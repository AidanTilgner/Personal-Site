import type { Socket } from "socket.io";
import type { Block } from "../../types/blocks";
import { getChatCompletionStream } from "../utils/openai";
import type { ChatCompletionRequestMessage } from "openai-edge";

export const startBlockResponseStream = async (
  socket: Socket,
  blocks: Block[],
  conversation: ChatCompletionRequestMessage[],
) => {
  try {
    const response = await getChatCompletionStream([
      {
        role: "system",
        content: `
        You are a chatbot that lives on a website for Aidan Tilgner.
        Your job is to answer questions, and overall respond to users in a helpful and witty manner.
        Context will be provided to you about what the user is currently looking at as well.
        `,
      },
      {
        role: "system",
        content: `
        Here is some context as to what the user is looking at.
        Each "block" is a different section of the page that the user has in view, based on their message:

        ${blocks.map((b) => {
          return `
            ${b.name}:
            ${b.description}
        `;
        })}
        `,
      },
      ...conversation,
    ]);

    if (!response.success || !response.stream) {
      return socket.emit("block-response-stream", {
        success: false,
        message_fragment: "Something went wrong.",
        done: true,
      });
    }

    const stream = response.stream;
    const reader = stream.getReader();
    let count = 0;

    const readStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          // Stream has ended
          socket.emit("block-response-stream", {
            success: true,
            message_fragment: "",
            done: true,
          });
          return;
        }

        const decodedValue = new TextDecoder("utf-8").decode(value);

        socket.emit("block-response-stream", {
          success: true,
          message_fragment: decodedValue,
          done: false,
          index: count++,
        });

        readStream();
      });
    };

    readStream();
  } catch (error) {
    console.error(error);
    socket.emit("block-response-stream", {
      success: false,
      message_fragment: "Something went wrong.",
      done: true,
    });
  }
};

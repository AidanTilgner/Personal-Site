import type { Socket } from "socket.io";
import type { Block } from "../../types/blocks";
import { getChatCompletionStream } from "../utils/openai";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { format } from "prettier";
import type { Message } from "../../types/conversation";
import { getGPTConfig } from "../config";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const checkCache = (prompt: string) => {
  const cache = readFileSync(
    path.join(__dirname, "./.cache/responses.json"),
    "utf-8",
  ).toString();
  const parsedCache = cache.startsWith("{") ? JSON.parse(cache) : {};
  const cachedResponse = parsedCache[prompt];
  if (!cachedResponse) {
    return undefined;
  }
  return cachedResponse;
};

export const cacheResponse = async (prompt: string, response: string) => {
  const cache = readFileSync(
    path.join(__dirname, "./.cache/responses.json"),
    "utf-8",
  ).toString();
  const parsedCache = cache.startsWith("{") ? JSON.parse(cache) : {};
  parsedCache[prompt] = response;
  writeFileSync(
    path.join(__dirname, "./.cache/responses.json"),
    await format(JSON.stringify(parsedCache), { parser: "json" }),
  );
};

function createWordStream(input: string, interval: number) {
  const words = input.split(" ");
  let index = 0;

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const pushWord = () => {
        if (index < words.length) {
          const word = words[index] + " ";
          const encoded = encoder.encode(word);
          controller.enqueue(encoded);
          index++;
        } else {
          clearInterval(intervalId);
          controller.close();
        }
      };

      const intervalId = setInterval(pushWord, interval);
    },
  });
}

export const emitStreamToSocket = (
  socket: Socket,
  stream: ReadableStream,
  onComplete?: (fm: string) => void,
) => {
  const reader = stream.getReader();

  let full_message = "";
  let count = 0;

  const readStream = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        if (onComplete) {
          onComplete(full_message);
        }
        socket.emit("block-response-stream", {
          success: true,
          message_fragment: "",
          done: true,
          full_message,
          index: count,
        });
        return;
      }

      const decodedValue = new TextDecoder("utf-8").decode(value);

      full_message += decodedValue;

      socket.emit("block-response-stream", {
        success: true,
        message_fragment: decodedValue,
        done: false,
        index: count++,
        full_message,
      });

      readStream();
    });
  };

  readStream();
};

export const startBlockResponseStream = async (
  socket: Socket,
  blocks: Block[],
  conversation: Message[],
) => {
  try {
    const lastText = conversation[conversation.length - 1].content;
    const cachedResponse = checkCache(lastText);

    if (cachedResponse) {
      emitStreamToSocket(socket, createWordStream(cachedResponse, 50));
      return;
    }

    const config = getGPTConfig();

    const response = await getChatCompletionStream([
      {
        role: "system",
        content: `
        You are a chatbot that lives on a website for ${config.owner.name}.
        Your job is to answer questions, and overall respond to users in a helpful but witty manner.
        Context will be provided to you about what the user is currently looking at as well.

        Here is some info about ${
          config.owner.name
        }. Who is described as follows:
        "${config.owner.description}"

        ${config.owner.name} also has the following skillset:
        ${config.owner.skills.map((s) => {
          return `- ${s[0]}: ${s[1]}\n`;
        })}

        Here are some important links to keep in mind:
        ${config.owner.links.map((l) => {
          return `- ${l[0]}: ${l[1]}\n`;
        })}

        Here is some context as to what the user is looking at.
        Each "block" is a different section of the page that the user has in view, based on their message:

        ${blocks.map((b) => {
          return `
            ${b.name}:
            ${b.description}
        `;
        })}

        Things to keep in mind:
        - You don't perform actions, just respond to user queries
        - Markdown and html will be parsed and rendered
        - If something about ${
          config.owner.name
        } isn't provided in context, don't say it. Instead, favor "I don't know."
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

    emitStreamToSocket(socket, stream, (fm) => {
      cacheResponse(lastText, fm);
    });
  } catch (error) {
    console.error(error);
    socket.emit("block-response-stream", {
      success: false,
      message_fragment: "Something went wrong.",
      done: true,
    });
  }
};
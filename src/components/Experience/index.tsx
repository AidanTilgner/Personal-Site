import React, { useEffect, useRef, useState } from "react";
import Intro from "./Intro/Intro";
import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import type { Message } from "../../../types/conversation";
import Content from "./Chat/Content/Content";
import type { Block } from "../../../types/blocks";
import { getSocket, socket } from "../../utils/socket.io-client";
import MessageDisplay from "./Chat/MessageDisplay/MessageDisplay";

function index() {
  const [loading, setLoading] = useState(true);
  const [playingIntro, setPlayingIntro] = useState(false);
  const conversation = useRef<Message[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [displayMessage, setDisplayMessage] = useState<string>("");
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  const addMessage = (message: Message) => {
    conversation.current = [...conversation.current, message];
  };

  useEffect(() => {
    if (localStorage.getItem("seen_intro") !== "true") {
      setPlayingIntro(true);
    }
  }, []);

  const submitMessage = async () => {
    if (!conversation || loading) {
      return;
    }
    const response = await fetch(`/api/content`, {
      method: "POST",
      body: JSON.stringify({
        conversation: conversation.current,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-socket-id": getSocket().id,
      },
    });
    const data = await response.json();

    setBlocks(data.data.blocks);
  };

  const storeConversation = () => {
    sessionStorage.setItem(
      "conversation",
      JSON.stringify(conversation.current),
    );
  };

  const playDefaultMessage = () => {
    setMessageLoading(true);
    const m = "Hello there, I'm Aidan's website, how can I help you?";
    const words = m.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      const isLast = i === words.length - 1;
      setDisplayMessage((prev) => {
        return prev + words[i] + " ";
      });
      i++;
      if (isLast) {
        setMessageLoading(false);
        addMessage({
          role: "assistant",
          content: m,
        });
        clearInterval(interval);
      }
    }, 200);
    return interval;
  };

  useEffect(() => {
    const storedConversation = sessionStorage.getItem("conversation");
    if (storedConversation) {
      conversation.current = storedConversation.startsWith("[")
        ? JSON.parse(storedConversation)
        : [];
    }

    socket.on(
      "block-response-stream",
      (message: {
        success: boolean;
        message_fragment: string;
        done: boolean;
        index: number;
        full_message: string;
      }) => {
        if (message.done) {
          setMessageLoading(false);
          setDisplayMessage(message.full_message);
          addMessage({
            role: "assistant",
            content: message.full_message,
          });
          return;
        }
        setDisplayMessage((prev) => {
          // if it wasn't loading before, then it's a new message
          if (message.index === 0) {
            return message.message_fragment;
          }
          return prev + message.message_fragment;
        });
        setMessageLoading(true);
      },
    );

    const int = playDefaultMessage();

    socket.on("connect", () => {
      setLoading(false);
    });

    return () => {
      storeConversation();
      socket.off("block-response-stream");
      socket.off("connect");
      clearInterval(int);
    };
  }, []);

  return (
    <div className={styles.experience}>
      {playingIntro && (
        <Intro
          onComplete={() => {
            setPlayingIntro(false);
          }}
        />
      )}
      {!playingIntro && (
        <div className={styles.chat}>
          <div className={styles.content}>
            <Content blocks={blocks} />
          </div>
          <div className={styles.text}>
            <div className={styles.display_message}>
              <MessageDisplay
                message={displayMessage}
                is_streaming={messageLoading}
              />
            </div>
            <div className={styles.textbox}>
              <TextBox
                onSubmit={(text) => {
                  addMessage({
                    role: "user" as const,
                    content: text,
                  });
                  submitMessage();
                }}
                suggestions={[
                  "What is this?",
                  "Aidan Who?",
                  "Projects.",
                  "Skills.",
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default index;

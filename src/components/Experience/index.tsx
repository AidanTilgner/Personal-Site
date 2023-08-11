import React, { useEffect, useState } from "react";
import Intro from "./Intro/Intro";
import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import type { Message } from "../../types/main";
import Content from "./Chat/Content/Content";
import type { Block } from "../../../types/blocks";
import { getSocket, socket } from "../../utils/socket.io-client";
import MessageDisplay from "./Chat/MessageDisplay/MessageDisplay";

function index() {
  const [loading, setLoading] = useState(true);
  const [playingIntro, setPlayingIntro] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [query, setQuery] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [displayMessage, setDisplayMessage] = useState<string>("");
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("seen_intro") !== "true") {
      setPlayingIntro(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!query || loading) {
        return;
      }
      const response = await fetch(`/api/content?query="${query}"`, {
        headers: {
          "Content-Type": "application/json",
          "x-socket-id": getSocket().id,
        },
      });
      const data = await response.json();

      setBlocks(data.data.blocks);
    })();

    if (query) {
      const url = new URL(window.location.href);
      const urlSearchParams = new URLSearchParams(url.search);
      urlSearchParams.set("query", query);
      url.search = urlSearchParams.toString();
      window.history.pushState({}, "", url.toString());
    }
  }, [query, loading]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const q = urlSearchParams.get("query");

    if (q) {
      setQuery(q);
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

    socket.on("connect", () => {
      setLoading(false);
    });
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
                  setConversation([
                    ...conversation,
                    {
                      role: "user" as const,
                      content: text,
                    },
                  ]);
                  setQuery(text);
                }}
                suggestions={[
                  "What is this?",
                  "Aidan? Who?",
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

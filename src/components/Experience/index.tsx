import React, { useEffect, useState } from "react";
import Intro from "./Intro/Intro";
import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import type { Message } from "../../types/main";
import Content from "./Chat/Content/Content";
import type { Block } from "../../../types/blocks";

function index() {
  const [playingIntro, setPlayingIntro] = useState(true);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [query, setQuery] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    (async () => {
      if (!query) {
        return;
      }
      console.log("Getting blocks with query: ", query);
      const response = await fetch(`/api/content?query="${query}"`);
      const data = await response.json();

      console.log("Data: ", data);

      setBlocks(data.data);
    })();
  }, [query]);

  console.log("Blocks: ", blocks);

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
              suggestions={["What is this?", "Aidan? Who?", "Aidan's Projects"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default index;

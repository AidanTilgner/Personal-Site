import React from "react";
import Intro from "./Intro/Intro";
import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import type { Message } from "../../types/main";
import Content from "./Chat/Content/Content";

function index() {
  const [playingIntro, setPlayingIntro] = React.useState(true);
  const [conversation, setConversation] = React.useState<Message[]>([]);

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
            <Content />
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
              }}
              suggestions={["What is this?", "Aidan? Who?"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default index;

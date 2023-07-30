import React from "react";
import Intro from "./Intro/Intro";
import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import type { Message } from "../../types/main";

function index() {
  const [playingIntro, setPlayingIntro] = React.useState(false);
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
              suggestions={[
                "What is Aidan's experience?",
                "Why should I hire Aidan?",
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default index;

/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-useless-escape */
import React, { useEffect } from "react";
import styles from "./MessageDisplay.module.scss";
import showdown from "showdown";

interface MessageDisplayProps {
  message: string;
  is_streaming: boolean;
}

const converter = new showdown.Converter();

const parseMarkdown = (message: string) => {
  return converter.makeHtml(message);
};

function MessageDisplay({ message, is_streaming }: MessageDisplayProps) {
  const [characterHover, setCharacterHover] = React.useState(false);

  const CharacterStates = [
    <pre key={"state-1"}>
      {`
      //
   _oo\\
  (__/ \\  _  _
     \\  \\/ \\/ \\
     (         )\\
      \\_______/  \\
       [[] [[]]
       [[] [[]]
      `}
    </pre>,
    <pre key={"state-2"}>
      {`
      //
   _oo\\
  (o_/ \\  _  _
     \\  \\/ \\/ \\
     (         )\\
      \\_______/  \\
       [[] [[]]
       [[] [[]]
      `}
    </pre>,
    <pre key={"state-3"}>
      {`
      //
   _oo\\
  (O_/ \\  _  _
     \\  \\/ \\/ \\
     (         )\\
      \\_______/  \\
       [[] [[]]
       [[] [[]]
      `}
    </pre>,
    <pre key={"state-4"}>
      {`
      //
   _oo\\
  (o_/ \\  _  _
     \\  \\/ \\/ \\
     (         )\\
      \\_______/  \\
       [[] [[]]
       [[] [[]]
      `}
    </pre>,
  ];

  const characterWinkState = (
    <pre>
      {`
      //
   _o-\\
  (*_/ \\  _  _
     \\  \\/ \\/ \\
     (         )\\
      \\_______/  \\
       [[] [[]]
       [[] [[]]
      `}
    </pre>
  );

  const [currentCharacterState, setCurrentCharacterState] = React.useState(0);

  useEffect(() => {
    if (is_streaming) {
      const interval = setInterval(() => {
        setCurrentCharacterState((prev) => (prev + 1) % CharacterStates.length);
      }, 100);
      return () => clearInterval(interval);
    }
    if (!is_streaming) {
      setCurrentCharacterState(0);
    }
  }, [is_streaming]);

  const CurrentCharacterState = () => {
    return CharacterStates[currentCharacterState];
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <div className={styles.message_display}>
      <a
        className={`${styles.character} ${message ? styles.with_message : ""}`}
        title="*camel noises*"
        href="/petting-zoo"
        onMouseEnter={() => setCharacterHover(true)}
        onMouseLeave={() => setCharacterHover(false)}
      >
        {characterHover ? characterWinkState : <CurrentCharacterState />}
      </a>
      <span className={styles.disclaimer}>* This isn't done yet so don't trust output</span>
      <p className={styles.message}>
        <span
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(message),
          }}
        />
        <span ref={scrollRef} />
      </p>
    </div>
  );
}

export default MessageDisplay;

/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-useless-escape */
import React, { useEffect } from "react";
import styles from "./MessageDisplay.module.scss";

interface MessageDisplayProps {
  message: string;
  is_streaming: boolean;
}

function MessageDisplay({ message, is_streaming }: MessageDisplayProps) {
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

  const [currentCharacterState, setCurrentCharacterState] = React.useState(0);

  console.log(
    "Current character state: ",
    CharacterStates[currentCharacterState],
  );

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

  return (
    <div className={styles.message_display}>
      <a
        className={styles.character}
        title="*camel noises*"
        href="/?query=ocaml"
      >
        <CurrentCharacterState />
      </a>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default MessageDisplay;

/* eslint-disable no-useless-escape */
import React, { useEffect } from "react";
import type { AnimalProps } from "..";
import styles from "./styles/animal.module.scss";

function Camel({ is_talking, talk_speed }: AnimalProps) {
  const [currentCharacterState, setCurrentCharacterState] = React.useState(0);

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

  useEffect(() => {
    if (is_talking) {
      const interval = setInterval(() => {
        setCurrentCharacterState((prev) => (prev + 1) % CharacterStates.length);
      }, talk_speed);
      return () => clearInterval(interval);
    }
    if (!is_talking) {
      setCurrentCharacterState(0);
    }
  }, [is_talking]);

  const CurrentCharacterState = () => {
    return CharacterStates[currentCharacterState];
  };

  const [is_hovering, setIsHovering] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title="*camel noises*"
      className={styles.animal}
      id="camel"
    >
      <div className={styles.background}>
        <pre>
          {`
                    ,,           .-.
           .       || |     .     ) )
                   || |   ,      '-'
                   || |  | |   .
                   || '--' |
        .    ,,    || .----'
            || |   || |   .
            |  '---'| |
            '------.| |        .
            .      || |
                   || | .        *
         ____\\|/___||_|_________\\|/____
        `}
        </pre>
      </div>
      <div className={styles.animal_itself}>
        {is_hovering ? characterWinkState : <CurrentCharacterState />}
      </div>
      {is_hovering && (
        <p className={styles.description}>
          Camels are mammals with long legs, a big-lipped snout and a humped
          back. They are most commonly found in the deserts of Africa and Asia.
          Also,{" "}
          <a
            href="https://ocaml.org/"
            target="_blank"
            rel="noopenner noreferrer"
          >
            OCaml
          </a>{" "}
          is a great programming language!
        </p>
      )}
    </div>
  );
}

export default Camel;

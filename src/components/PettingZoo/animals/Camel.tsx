/* eslint-disable no-useless-escape */
import React, { useEffect, useRef } from "react";
import type { AnimalProps } from "..";
import styles from "./styles/animal.module.scss";
import { usePets } from "./animal";

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
      (v_/ \\  _  _
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

  const [shouldWink, setShouldWink] = React.useState(false);
  const petsRef = useRef<HTMLParagraphElement>(null);
  const { triggerPet } = usePets({
    name: "cosmo_the_camel",
    petsRef,
  });

  return (
    <div
      onClick={() => {
        setShouldWink((prev) => !prev);
      }}
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
      <div
        className={styles.animal_itself}
        onMouseEnter={() => {
          triggerPet();
        }}
      >
        {shouldWink ? characterWinkState : <CurrentCharacterState />}
      </div>
      <div className={styles.metadata}>
        <p className={styles.name}>Cosmo the Camel</p>
        <p className={styles.total_pets} ref={petsRef} />
      </div>
      {shouldWink && (
        <p className={styles.description}>
          <span>{`Cosmo's`} eyes gaze high</span>
          <br />
          <span>Earth-bound camel dreams of stars</span>
          <br />
          <span>Space calls, he {`can't`} fly</span>
        </p>
      )}
    </div>
  );
}

export default Camel;

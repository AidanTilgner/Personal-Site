/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef } from "react";
import type { AnimalProps } from "..";
import { usePets } from "./animal";
import styles from "./styles/animal.module.scss";

// ! WORK IN PROGRESS

function Bat({ is_talking, talk_speed }: AnimalProps) {
  const [currentCharacterState, setCurrentCharacterState] = React.useState(0);

  const CharacterStates = [
    // prettier-ignore
    <pre key={"state-1"}>
{`
 /\                 /\
 / \'._   (\_/)   _.'/ \
 |.''._'--(o.o)--'_.''.|
  \_ / \`;=/ " \=;\` \ _/
    \`\__| \___/ |__/\`
 jgs     \(_|_)/
          " \` "
`}
        </pre>,
    // prettier-ignore
    <pre key={"state-2"}>
{`
 /\                 /\
 / \'._   (\_/)   _.'/ \
 |.''._'--(-.O)--'_.''.|
  \_ / \`;=/ " \=;\` \ _/
    \`\__| \___/ |__/\`
 jgs     \(_|_)/
          " \` "
`}
    </pre>,
    // prettier-ignore
    <pre key={"state-3"}>
{`
 /\                 /\
 / \'._   (\_/)   _.'/ \
 |.''._'--(O.o)--'_.''.|
  \_ / \`;=/ " \=;\` \ _/
    \`\__| \___/ |__/\`
 jgs     \(_|_)/
          " \` "
`}
    </pre>,
  ];

  const characterWinkState =
    // prettier-ignore
    <pre>
{`
 /\                 /\
 / \'._   (\_/)   _.'/ \
 |.''._'--(o.-)--'_.''.|
  \_ / \`;=/ " \=;\` \ _/
    \`\__| \___/ |__/\`
 jgs     \(_|_)/
          " \` "
`}
    </pre>;

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
    name: "bruce_the_bat",
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
        <p className={styles.name}>
          Bruce the Bat <sup>TM</sup>
        </p>
        <p className={styles.total_pets} ref={petsRef} />
      </div>
      {shouldWink && (
        <p className={styles.description}>
          <span>Yeah that other guy totally stole my thunder.</span>
        </p>
      )}
    </div>
  );
}

export default Bat;

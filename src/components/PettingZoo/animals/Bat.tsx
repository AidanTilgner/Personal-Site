/* eslint-disable no-useless-escape -- ASCII art uses literal backslashes. */
import React, { useEffect } from "react";
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
        setCurrentCharacterState((prev) => (prev + 1) % 3);
      }, talk_speed);
      return () => clearInterval(interval);
    }
  }, [is_talking, talk_speed]);

  const [shouldWink, setShouldWink] = React.useState(false);
  const { triggerPet, numPets } = usePets({
    name: "bruce_the_bat",
  });

  return (
    <div className={styles.animal} id="bat">
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
      <button
        type="button"
        className={styles.animal_itself}
        onClick={() => setShouldWink((previous) => !previous)}
        onMouseEnter={() => {
          triggerPet();
        }}
        title="*bat noises*"
      >
        {shouldWink
          ? characterWinkState
          : CharacterStates[is_talking ? currentCharacterState : 0]}
      </button>
      <div className={styles.metadata}>
        <p className={styles.name}>
          Bruce the Bat <sup>TM</sup>
        </p>
        <p className={styles.total_pets}>pets: {numPets}</p>
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

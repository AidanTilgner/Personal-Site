import React, { useEffect } from "react";
import type { AnimalProps } from "..";
import styles from "./styles/animal.module.scss";
import { usePets } from "./animal";

function Camel({ is_talking, talk_speed }: AnimalProps) {
  const [currentCharacterState, setCurrentCharacterState] = React.useState(0);
  const [shouldTalk, setShouldTalk] = React.useState(is_talking);

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
          |/
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
          \\/
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
          |/
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

  const petsThreshold = 15;

  const [shouldWink, setShouldWink] = React.useState(false);
  const { numPets, petHandlers } = usePets({
    name: "cosmo_the_camel",
    setTalking: setShouldTalk,
  });

  useEffect(() => {
    if (shouldTalk && numPets >= petsThreshold) {
      const interval = setInterval(() => {
        setCurrentCharacterState((prev) => (prev + 1) % 4);
      }, talk_speed);
      return () => clearInterval(interval);
    }
  }, [numPets, shouldTalk, talk_speed]);

  return (
    <div className={styles.animal} id="camel">
      <div className={styles.background}>
        <pre>
          {`
   .-.      ,,           
    ) )    || |     . 
   '-'     || |   , 
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
        title="*camel noises*"
        {...petHandlers}
      >
        {shouldWink
          ? characterWinkState
          : CharacterStates[shouldTalk ? currentCharacterState : 0]}
      </button>
      <div className={styles.metadata}>
        <p className={styles.name}>Cosmo the Camel</p>
        <p className={styles.total_pets}>pets: {numPets}</p>
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

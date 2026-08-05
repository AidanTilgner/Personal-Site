/* eslint-disable no-useless-escape -- ASCII art uses literal backslashes. */
import React, { useEffect } from "react";
import type { AnimalProps } from "..";
import { usePets } from "./animal";
import styles from "./styles/animal.module.scss";

function Shark({ is_talking, talk_speed }: AnimalProps) {
  const [currentCharacterState, setCurrentCharacterState] = React.useState(0);
  const [shouldTalk, setShouldTalk] = React.useState(is_talking);

  const CharacterStates = [
    <pre key={"state-1"}>
      {`
      .            
     \\_____)\_____
      /--v____ __\`<         
              )/           
              '

`}
    </pre>,
    <pre key={"state-2"}>
      {`
      .            
     \\_____)\_____
      /--v____ __\`<         
              )/           
              '


`}
    </pre>,
    <pre key={"state-3"}>
      {`
      .            
     \\_____)\_____
      /--v____ __\`-         
              )/           
              '



`}
    </pre>,
    <pre key={"state-4"}>
      {`
      .            
     \\_____)\_____
      /--v____ __\`-         
              )/           
              '


`}
    </pre>,
    <pre key={"state-5"}>
      {`
      .            
     \\_____)\_____
      /--v____ __\`<         
              )/           
              '

`}
    </pre>,
  ];

  const characterWinkState = (
    <pre>
      {`
    .            
     \\_____)\_____
      /--v____ __\^<         
              )/           
              '


              `}
    </pre>
  );

  const [shouldWink, setShouldWink] = React.useState(false);
  const petsThreshold = 50;

  const { numPets, petHandlers } = usePets({
    name: "sharkira_the_shark",
    setTalking: setShouldTalk,
  });

  useEffect(() => {
    if (shouldTalk && numPets >= petsThreshold) {
      const interval = setInterval(() => {
        setCurrentCharacterState((prev) => (prev + 1) % 5);
      }, talk_speed);
      return () => clearInterval(interval);
    }
  }, [numPets, shouldTalk, talk_speed]);

  return (
    <div className={styles.animal} id="shark">
      <div className={styles.background}>
        <pre>
          {`
       c<
     c<  
       c<
                              

                             

                                
     ____\\|/__________\\|/__\\|/____
    `}
        </pre>
      </div>
      <button
        type="button"
        className={styles.animal_itself}
        onClick={() => setShouldWink((previous) => !previous)}
        title="🎶 sharkira sharkira 🎶"
        {...petHandlers}
      >
        {shouldWink
          ? characterWinkState
          : CharacterStates[shouldTalk ? currentCharacterState : 0]}
      </button>
      <div className={styles.metadata}>
        <p className={styles.name}>Sharkira</p>
        <p className={styles.total_pets}>pets: {numPets}</p>
      </div>
      {shouldWink && (
        <p className={styles.description}>
          <span>Oh human, when you swim like that.</span>
          <br />
          <span>You make a shark go on the attack</span>
          <br />
          <span>So be wise and keep on</span>
          <br />
          <span>Reading the fins of my body</span>
          <br />
        </p>
      )}
    </div>
  );
}

export default Shark;

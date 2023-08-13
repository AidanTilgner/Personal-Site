/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef } from "react";
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
  const petsRef = useRef<HTMLParagraphElement>(null);
  const animalRef = useRef<HTMLDivElement>(null);

  const petsThreshold = 50;

  const { num_pets } = usePets({
    name: "sharkira_the_shark",
    petsRef,
    animalRef,
    setTalking: setShouldTalk,
  });

  useEffect(() => {
    if (shouldTalk && num_pets >= petsThreshold) {
      const interval = setInterval(() => {
        setCurrentCharacterState((prev) => (prev + 1) % CharacterStates.length);
      }, talk_speed);
      return () => clearInterval(interval);
    }
    if (!shouldTalk) {
      setCurrentCharacterState(0);
    }
  }, [shouldTalk, num_pets]);

  const CurrentCharacterState = () => {
    return CharacterStates[currentCharacterState];
  };

  return (
    <div
      onClick={() => {
        setShouldWink((prev) => !prev);
      }}
      title="🎶sharkira sharkira🎶"
      className={styles.animal}
      id="camel"
    >
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
      <div className={styles.animal_itself} ref={animalRef}>
        {shouldWink ? characterWinkState : <CurrentCharacterState />}
      </div>
      <div className={styles.metadata}>
        <p className={styles.name}>Sharkira</p>
        <p className={styles.total_pets} ref={petsRef} />
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

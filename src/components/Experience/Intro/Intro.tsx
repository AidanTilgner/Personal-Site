import React, { useEffect, useRef } from "react";
import styles from "./Intro.module.scss";
import { X } from "@phosphor-icons/react";

function Intro({ onComplete }: { onComplete: () => void }) {
  const phases = [
    "Hey there, I'm Aidan.",
    "I'm a Software Engineer, AI Engineer, and Experience Designer.",
    "Welcome to my site!",
  ];

  const [cPhase, setCPhase] = React.useState(0);
  const [cursorBlink, setCursorBlink] = React.useState(true);

  const currentPhase = phases[cPhase];

  const textRef = React.useRef<HTMLElement>(null);
  const cursorRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (localStorage.getItem("seen_intro") === "true") {
      onComplete();
    }
    localStorage.setItem("seen_intro", "true");
  }, []);

  const playPhase = () => {
    for (let i = 0; i < currentPhase.length; i++) {
      setTimeout(() => {
        const isLast = i === currentPhase.length - 1;
        if (textRef.current) {
          textRef.current.innerHTML += currentPhase[i];
        }
        if (isLast) {
          setCursorBlink(true);
        }
      }, i * 50);
    }
  };

  const nextPhase = () => {
    if (cPhase === phases.length - 1) {
      onComplete();
      return;
    }
    setCPhase(cPhase + 1);
    if (textRef.current) {
      textRef.current!.innerHTML = "";
    }
  };

  const betweenTime = 3000;
  const delay = 1000;

  useEffect(() => {
    setTimeout(() => {
      playPhase();
    }, delay);
    const timeout = setTimeout(() => {
      nextPhase();
    }, currentPhase.length * 50 + betweenTime + delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [cPhase]);

  const cursorVisible = useRef(true);

  const toggleCursorVisibility = () => {
    cursorVisible.current = !cursorVisible.current;
    cursorRef.current!.style.opacity = cursorVisible.current ? "1" : "0";
  };

  useEffect(() => {
    if (cursorBlink) {
      const interval = setInterval(() => {
        toggleCursorVisibility();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [cursorBlink]);

  return (
    <div className={styles.intro} id="experience-intro">
      <span className={styles.text} ref={textRef} />
      <span className={styles.cursor} ref={cursorRef} />
      <button className={styles.close} onClick={onComplete} title="Too cheesy.">
        <X weight="bold" />
      </button>
    </div>
  );
}

export default Intro;

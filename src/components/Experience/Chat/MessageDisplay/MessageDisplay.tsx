import { useEffect, useRef, useState } from "react";
import styles from "./MessageDisplay.module.scss";
import Markdown from "react-markdown";

interface MessageDisplayProps {
  message: string;
  is_streaming: boolean;
  latestQuestion: string | null;
}

const camelStates = [
  String.raw`      //
   _oo\
  (__/ \  _  _
     \  \/ \/ \
     (         )\
      \_______/  \
       [[] [[]]`,
  String.raw`      |/
   _oo\
  (o_/ \  _  _
     \  \/ \/ \
     (         )\
      \_______/  \
       [[] [[]]`,
  String.raw`      \/
   _oo\
  (O_/ \  _  _
     \  \/ \/ \
     (         )\
      \_______/  \
       [[] [[]]`,
];

const camelWink = String.raw`      //
   _o-\
  (*_/ \  _  _
     \  \/ \/ \
     (         )\
      \_______/  \
       [[] [[]]`;

function MessageDisplay({
  message,
  is_streaming,
  latestQuestion,
}: MessageDisplayProps) {
  const [hovered, setHovered] = useState(false);
  const [currentState, setCurrentState] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!is_streaming) {
      setCurrentState(0);
      return;
    }
    const interval = window.setInterval(() => {
      setCurrentState((previous) => (previous + 1) % camelStates.length);
    }, 180);
    return () => window.clearInterval(interval);
  }, [is_streaming]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [message]);

  return (
    <div className={styles.messageDisplay}>
      <a
        className={styles.character}
        title="Visit Cosmo in the petting zoo"
        href="/petting-zoo"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Cosmo the camel — visit the petting zoo"
      >
        <pre aria-hidden="true">
          {hovered ? camelWink : camelStates[currentState]}
        </pre>
      </a>
      <div className={styles.exchange}>
        {latestQuestion && (
          <div
            className={styles.latestQuestion}
            aria-label="Your latest question"
          >
            <span>You asked</span>
            <p>{latestQuestion}</p>
          </div>
        )}
        <div
          className={styles.response}
          aria-live="polite"
          aria-busy={is_streaming}
        >
          {message ? (
            <Markdown
              skipHtml
              components={{
                a: ({ href, children }) => {
                  const external = href?.startsWith("http");
                  return (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message}
            </Markdown>
          ) : (
            <p className={styles.thinking}>Looking through the index…</p>
          )}
          {is_streaming && (
            <span className={styles.cursor} aria-hidden="true" />
          )}
          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
}

export default MessageDisplay;

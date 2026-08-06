import { useEffect, useRef, useState } from "react";
import styles from "./MessageDisplay.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageDisplayProps {
  message: string;
  is_streaming: boolean;
  latestQuestion: string | null;
  compact?: boolean;
  onSuggestionSelect?: (suggestion: string) => void;
  suggestions?: string[];
  suggestionsDisabled?: boolean;
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
  compact = false,
  onSuggestionSelect,
  suggestions = [],
  suggestionsDisabled = false,
}: MessageDisplayProps) {
  const [hovered, setHovered] = useState(false);
  const [currentState, setCurrentState] = useState(0);
  const exchangeRef = useRef<HTMLDivElement>(null);

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
    if (latestQuestion) exchangeRef.current?.scrollTo({ top: 0 });
  }, [latestQuestion]);

  return (
    <div
      className={`${styles.messageDisplay} ${latestQuestion ? styles.hasConversation : ""} ${compact ? styles.compact : ""}`}
    >
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
      <div className={styles.exchange} ref={exchangeRef}>
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
          data-streaming={is_streaming || undefined}
        >
          {message ? (
            <Markdown
              skipHtml
              remarkPlugins={[remarkGfm]}
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
        </div>
        {latestQuestion && message && !is_streaming && suggestions.length > 0 && (
          <div className={styles.followUps} aria-label="Suggested questions">
            <p>You might ask next</p>
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => onSuggestionSelect?.(suggestion)}
                disabled={suggestionsDisabled}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageDisplay;

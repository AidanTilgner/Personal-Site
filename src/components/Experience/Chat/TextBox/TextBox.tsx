import { useState } from "react";
import styles from "./TextBox.module.scss";

interface TextBoxProps {
  onSubmit: (text: string) => void;
  suggestions: string[];
  disabled?: boolean;
  showSuggestions?: boolean;
  prominent?: boolean;
}

function TextBox({
  onSubmit,
  suggestions,
  disabled = false,
  showSuggestions = true,
  prominent = false,
}: TextBoxProps) {
  const [text, setText] = useState("");

  const handleSubmit = (value: string) => {
    const query = value.trim();
    if (!query || disabled) return;
    setText("");
    onSubmit(query);
  };

  return (
    <div
      className={`${styles.textbox} ${prominent ? styles.prominent : ""}`}
    >
      {showSuggestions && (
        <div className={styles.suggestions} aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              className={styles.suggestion}
              onClick={() => handleSubmit(suggestion)}
              key={suggestion}
              disabled={disabled}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form
        className={styles.textboxcontainer}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(text);
        }}
      >
        <label className={styles.visuallyHidden} htmlFor="site-query">
          Ask about Aidan
        </label>
        <div>
          <span className={styles.promptMark} aria-hidden="true">
            &gt;
          </span>
          <input
            id="site-query"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type a question..."
            autoComplete="off"
            disabled={disabled}
          />
          <button
            className={styles.sendmessage}
            type="submit"
            disabled={disabled || !text.trim()}
            aria-label="Send question"
          >
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default TextBox;

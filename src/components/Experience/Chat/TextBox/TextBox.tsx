import React from "react";
import styles from "./TextBox.module.scss";
import { ArrowCircleRight } from "@phosphor-icons/react";

function TextBox({
  onSubmit,
  suggestions,
}: {
  onSubmit: (text: string) => void;
  suggestions: string[];
}) {
  const [text, setText] = React.useState("");

  const handleSubmit = (text: string) => {
    setText("");
    onSubmit(text);
  };

  return (
    <div className={styles.textbox}>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion) => {
          return (
            <button
              className={styles.suggestion}
              onClick={() => {
                handleSubmit(suggestion);
              }}
              key={suggestion}
            >
              {suggestion}
            </button>
          );
        })}
      </div>
      <div className={styles.textboxcontainer}>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Ask me anything..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(text);
            }
          }}
        />
        <button
          className={styles.sendmessage}
          onClick={() => handleSubmit(text)}
        >
          <ArrowCircleRight />
        </button>
      </div>
    </div>
  );
}

export default TextBox;

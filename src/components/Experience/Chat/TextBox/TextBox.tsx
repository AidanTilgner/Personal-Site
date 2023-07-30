import React from "react";
import styles from "./TextBox.module.scss";

function TextBox({
  onSubmit,
  suggestions,
}: {
  onSubmit: (text: string) => void;
  suggestions: string[];
}) {
  const [text, setText] = React.useState("");

  return (
    <div className={styles.textbox}>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion) => {
          return (
            <button
              className={styles.suggestion}
              onClick={() => {
                onSubmit(suggestion);
              }}
              key={suggestion}
            >
              {suggestion}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder="Ask me anything..."
      />
    </div>
  );
}

export default TextBox;

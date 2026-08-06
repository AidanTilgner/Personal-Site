import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import Content from "./Chat/Content/Content";
import MessageDisplay from "./Chat/MessageDisplay/MessageDisplay";
import { defaultAssistantPrompts, useChatSession } from "./Chat/useChatSession";

function Experience() {
  const {
    blocks,
    clearConversation,
    connection,
    connectionLabel,
    displayMessage,
    latestQuestion,
    messageLoading,
    submitMessage,
  } = useChatSession();

  return (
    <div className={styles.experience}>
      <section className={styles.workspace} aria-label="Adaptive content">
        <div
          className={styles.workspaceBody}
          aria-live="polite"
          data-workspace-scroll
        >
          <Content
            blocks={blocks}
            onStartConversation={() => submitMessage("Show me something cool")}
          />
        </div>
      </section>

      <aside className={styles.guide} aria-label="Ask Aidan's site">
        {(latestQuestion || blocks.length > 0) && (
          <button
            className={styles.clearConversation}
            type="button"
            onClick={clearConversation}
            title="Clear conversation context"
          >
            Clear
          </button>
        )}
        <span
          className={`${styles.connection} ${styles[connection]}`}
          title={connectionLabel}
          role="status"
          aria-label={connectionLabel}
        >
          <span />
        </span>
        <div className={styles.guideBody}>
          <MessageDisplay
            message={displayMessage}
            is_streaming={messageLoading}
            latestQuestion={latestQuestion}
          />
          <TextBox
            onSubmit={submitMessage}
            suggestions={defaultAssistantPrompts}
            disabled={connection !== "online" || messageLoading}
          />
        </div>
      </aside>
    </div>
  );
}

export default Experience;

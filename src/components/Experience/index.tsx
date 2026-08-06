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
    suggestedQuestions,
    submitMessage,
  } = useChatSession();
  const isArrival = !latestQuestion && blocks.length === 0;

  return (
    <div
      className={`${styles.experience} ${isArrival ? styles.arrival : styles.active}`}
    >
      <section className={styles.workspace} aria-label="Adaptive content">
        <div
          className={styles.workspaceBody}
          aria-live="polite"
          data-workspace-scroll
        >
          <Content
            blocks={blocks}
            isLoading={messageLoading}
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
        <div
          className={`${styles.guideBody} ${latestQuestion ? styles.hasConversation : ""}`}
        >
          {!isArrival && (
            <MessageDisplay
              message={displayMessage}
              is_streaming={messageLoading}
              latestQuestion={latestQuestion}
              onSuggestionSelect={submitMessage}
              suggestions={suggestedQuestions}
              suggestionsDisabled={connection !== "online" || messageLoading}
            />
          )}
          <TextBox
            onSubmit={submitMessage}
            suggestions={defaultAssistantPrompts}
            disabled={connection !== "online" || messageLoading}
            showSuggestions={!latestQuestion}
            prominent={isArrival}
          />
        </div>
      </aside>
    </div>
  );
}

export default Experience;

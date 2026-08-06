import { useEffect, useRef, useState } from "react";
import type { Block } from "../../../types/blocks";
import MessageDisplay from "../Experience/Chat/MessageDisplay/MessageDisplay";
import TextBox from "../Experience/Chat/TextBox/TextBox";
import {
  defaultAssistantPrompts,
  useChatSession,
} from "../Experience/Chat/useChatSession";
import styles from "./FloatingAssistant.module.scss";

interface FloatingAssistantProps {
  pagePath: string;
}

const launcherCamel = String.raw`   //
 _oo\
(__/ \ _ _
   \  V V \
   (      )\
    \____/  \
     [] []`;

const getPagePrompts = (path: string) => {
  if (path.startsWith("/projects")) {
    return [
      "Which projects show Aidan's strongest work?",
      "Show me Aidan's AI work",
      "What decisions shaped these projects?",
    ];
  }
  if (path.startsWith("/blog/posts/")) {
    return [
      "How does this connect to Aidan's work?",
      "What else has Aidan written?",
      "What are Aidan's strongest skills?",
    ];
  }
  if (path.startsWith("/blog")) {
    return [
      "What does Aidan write about?",
      "Show me relevant technical work",
      "What ideas does Aidan return to?",
    ];
  }
  if (path.startsWith("/stuff")) {
    return [
      "Show me something interesting",
      "What does Aidan experiment with?",
      "What has Aidan built?",
    ];
  }
  return defaultAssistantPrompts.slice(0, 3);
};

function ContextSummaryList({ blocks }: { blocks: Block[] }) {
  const [showAll, setShowAll] = useState(false);
  if (!blocks.length) return null;
  const visibleBlocks = showAll ? blocks : blocks.slice(0, 3);

  return (
    <section className={styles.contextShelf} aria-labelledby="cosmo-context">
      <div className={styles.contextHeading}>
        <h3 id="cosmo-context">Relevant context</h3>
        <span>{blocks.length.toString().padStart(2, "0")}</span>
      </div>
      <div className={styles.contextItems}>
        {visibleBlocks.map((block) => (
          <article key={block.id}>
            <span>Evidence</span>
            <h4>{block.name.replaceAll("-", " ")}</h4>
            <p>{block.description}</p>
          </article>
        ))}
      </div>
      {blocks.length > 3 && (
        <button
          className={styles.showMore}
          type="button"
          onClick={() => setShowAll((visible) => !visible)}
        >
          {showAll ? "Show less" : `Show ${blocks.length - 3} more`}
        </button>
      )}
      <a className={styles.openWorkspace} href="/?assistant=workspace">
        Open in full workspace <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}

function FloatingAssistant({ pagePath }: FloatingAssistantProps) {
  const {
    blocks,
    clearConversation,
    connection,
    connectionLabel,
    displayMessage,
    latestQuestion,
    messageLoading,
    panelOpen,
    setPanelOpen,
    submitMessage,
  } = useChatSession();
  const [unread, setUnread] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousLoading = useRef(messageLoading);
  const suggestions = latestQuestion ? [] : getPagePrompts(pagePath);

  const closePanel = () => {
    setPanelOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const openPanel = () => {
    setUnread(false);
    setPanelOpen(true);
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (previousLoading.current && !messageLoading && !panelOpen) {
      setUnread(true);
    }
    previousLoading.current = messageLoading;
  }, [messageLoading, panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
        return;
      }
      if (event.key !== "Tab" || !isMobile || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile, panelOpen, setPanelOpen]);

  return (
    <div className={`${styles.root} ${panelOpen ? styles.open : ""}`}>
      {panelOpen && isMobile && (
        <button
          className={styles.backdrop}
          type="button"
          onClick={closePanel}
          aria-label="Close Cosmo assistant"
          tabIndex={-1}
        />
      )}

      {panelOpen && (
        <section
          className={styles.panel}
          id="cosmo-assistant-panel"
          ref={panelRef}
          tabIndex={-1}
          role={isMobile ? "dialog" : "complementary"}
          aria-modal={isMobile || undefined}
          aria-labelledby="cosmo-panel-title"
        >
          <header className={styles.panelHeader}>
            <div>
              <span
                className={`${styles.statusDot} ${styles[connection]}`}
                aria-hidden="true"
              />
              <div>
                <h2 id="cosmo-panel-title">Cosmo</h2>
                <p>{connectionLabel}</p>
              </div>
            </div>
            <div className={styles.panelActions}>
              {(latestQuestion || blocks.length > 0) && (
                <button
                  type="button"
                  onClick={clearConversation}
                  title="Clear conversation context"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={closePanel}
                aria-label="Minimize Cosmo"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </header>

          <div className={styles.transcript}>
            <MessageDisplay
              compact
              message={displayMessage}
              is_streaming={messageLoading}
              latestQuestion={latestQuestion}
            />
            <ContextSummaryList blocks={blocks} />
            {connection === "offline" && (
              <nav
                className={styles.fallbackLinks}
                aria-label="Browse directly"
              >
                <a href="/projects">Work</a>
                <a href="/blog">Writing</a>
                <a href="mailto:aidantilgner02@gmail.com">Email</a>
              </nav>
            )}
          </div>

          <div className={styles.composer}>
            <TextBox
              onSubmit={submitMessage}
              suggestions={suggestions}
              disabled={connection !== "online" || messageLoading}
            />
          </div>
        </section>
      )}

      <button
        className={styles.launcher}
        ref={launcherRef}
        type="button"
        onClick={panelOpen ? closePanel : openPanel}
        aria-label={panelOpen ? "Minimize Cosmo" : "Ask Cosmo about Aidan"}
        aria-expanded={panelOpen}
        aria-controls="cosmo-assistant-panel"
      >
        <pre aria-hidden="true">{launcherCamel}</pre>
        <span
          className={`${styles.launcherStatus} ${styles[connection]}`}
          aria-hidden="true"
        />
        {unread && <span className={styles.unread} aria-label="New response" />}
      </button>
    </div>
  );
}

export default FloatingAssistant;

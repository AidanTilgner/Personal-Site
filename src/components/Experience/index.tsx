import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import TextBox from "./Chat/TextBox/TextBox";
import type { Message } from "../../../types/conversation";
import Content from "./Chat/Content/Content";
import type { Block } from "../../../types/blocks";
import type { ChatRequest } from "../../../types/chat";
import {
  createChatSocket,
  createRequestId,
  parseChatServerMessage,
  parseStoredConversation,
  trimConversation,
} from "../../utils/chat-client";
import MessageDisplay from "./Chat/MessageDisplay/MessageDisplay";

type ConnectionState = "connecting" | "online" | "offline";

const starterPrompts = [
  "Show me Aidan's AI work",
  "What has Aidan built?",
  "What are his strongest skills?",
  "How can we work together?",
];

const welcomeMessage =
  "Ask me about Aidan's work, experience, or the ideas he keeps returning to.";

function Experience() {
  const conversation = useRef<Message[]>([]);
  const socket = useRef<WebSocket | null>(null);
  const activeRequestId = useRef<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [displayMessage, setDisplayMessage] = useState(welcomeMessage);
  const [latestQuestion, setLatestQuestion] = useState<string | null>(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [connection, setConnection] = useState<ConnectionState>("connecting");

  const storeConversation = () => {
    sessionStorage.setItem(
      "conversation",
      JSON.stringify(conversation.current),
    );
  };

  const submitMessage = (text: string) => {
    const query = text.trim();
    if (!query || messageLoading) return;

    setLatestQuestion(query);

    if (socket.current?.readyState !== WebSocket.OPEN) {
      setDisplayMessage(
        "The knowledge station is offline for a moment. You can still browse the work and writing directly.",
      );
      return;
    }

    const nextConversation = trimConversation([
      ...conversation.current,
      { role: "user" as const, content: query },
    ]);
    conversation.current = nextConversation;
    const requestId = createRequestId();
    activeRequestId.current = requestId;
    setDisplayMessage("");
    setMessageLoading(true);

    const request: ChatRequest = {
      type: "chat.request",
      requestId,
      conversation: nextConversation,
    };
    socket.current.send(JSON.stringify(request));
  };

  useEffect(() => {
    conversation.current = trimConversation(
      parseStoredConversation(sessionStorage.getItem("conversation")),
    );
    setLatestQuestion(
      [...conversation.current]
        .reverse()
        .find((message) => message.role === "user")?.content ?? null,
    );
    let disposed = false;
    let reconnectTimer: number | undefined;
    let reconnectAttempt = 0;

    const connect = () => {
      if (disposed) return;
      setConnection("connecting");
      let chatSocket: WebSocket;
      try {
        chatSocket = createChatSocket();
      } catch {
        setConnection("offline");
        return;
      }
      socket.current = chatSocket;

      chatSocket.addEventListener("message", (event) => {
        const message = parseChatServerMessage(event.data);
        if (!message || message.requestId !== activeRequestId.current) return;

        switch (message.type) {
          case "content.blocks":
            setBlocks(message.blocks);
            break;
          case "assistant.delta":
            setDisplayMessage((previous) =>
              message.index === 0 ? message.text : previous + message.text,
            );
            setMessageLoading(true);
            break;
          case "assistant.done":
            setMessageLoading(false);
            setDisplayMessage(message.message);
            conversation.current = trimConversation([
              ...conversation.current,
              { role: "assistant", content: message.message },
            ]);
            activeRequestId.current = null;
            break;
          case "error":
            setMessageLoading(false);
            setDisplayMessage(message.message);
            activeRequestId.current = null;
            break;
        }
      });

      chatSocket.addEventListener("open", () => {
        reconnectAttempt = 0;
        setConnection("online");
      });
      chatSocket.addEventListener("close", () => {
        if (socket.current === chatSocket) socket.current = null;
        activeRequestId.current = null;
        setConnection("offline");
        setMessageLoading(false);
        if (!disposed) {
          const delay = Math.min(1_000 * 2 ** reconnectAttempt++, 15_000);
          reconnectTimer = window.setTimeout(connect, delay);
        }
      });
      chatSocket.addEventListener("error", () => chatSocket.close());
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      storeConversation();
      socket.current?.close(1000, "Component unmounted");
      socket.current = null;
    };
  }, []);

  const connectionLabel = {
    connecting: "Connecting",
    online: "Knowledge online",
    offline: "Browse mode",
  }[connection];

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
            suggestions={starterPrompts}
            disabled={connection !== "online" || messageLoading}
          />
        </div>
      </aside>
    </div>
  );
}

export default Experience;

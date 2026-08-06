import { useCallback, useEffect, useRef, useState } from "react";
import type { Block } from "../../../../types/blocks";
import type { ChatRequest } from "../../../../types/chat";
import type { Message } from "../../../../types/conversation";
import {
  createChatSocket,
  createRequestId,
  parseChatServerMessage,
  parseStoredConversation,
  trimConversation,
} from "../../../utils/chat-client";
import {
  ASSISTANT_SESSION_KEY,
  createAssistantSession,
  parseAssistantSession,
} from "../../../utils/chat-session-storage";

export type ConnectionState = "connecting" | "online" | "offline";

export const assistantWelcomeMessage =
  "Ask me about Aidan's work, experience, or the ideas he keeps returning to.";

export const defaultAssistantPrompts = [
  "Show me Aidan's AI work",
  "What has Aidan built?",
  "What are his strongest skills?",
  "How can we work together?",
];

export const useChatSession = () => {
  const conversation = useRef<Message[]>([]);
  const socket = useRef<WebSocket | null>(null);
  const activeRequestId = useRef<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [displayMessage, setDisplayMessage] = useState(assistantWelcomeMessage);
  const [latestQuestion, setLatestQuestion] = useState<string | null>(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [panelOpen, setPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const submitMessage = useCallback(
    (text: string) => {
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
      setBlocks([]);
      setDisplayMessage("");
      setMessageLoading(true);

      const request: ChatRequest = {
        type: "chat.request",
        requestId,
        conversation: nextConversation,
      };
      socket.current.send(JSON.stringify(request));
    },
    [messageLoading],
  );

  const clearConversation = useCallback(() => {
    conversation.current = [];
    activeRequestId.current = null;
    sessionStorage.removeItem(ASSISTANT_SESSION_KEY);
    sessionStorage.removeItem("conversation");
    setBlocks([]);
    setDisplayMessage(assistantWelcomeMessage);
    setLatestQuestion(null);
    setMessageLoading(false);
  }, []);

  useEffect(() => {
    const stored = parseAssistantSession(
      sessionStorage.getItem(ASSISTANT_SESSION_KEY),
    );
    if (stored) {
      conversation.current = stored.conversation;
      setBlocks(stored.blocks);
      setDisplayMessage(stored.assistantMessage || assistantWelcomeMessage);
      setLatestQuestion(stored.latestQuestion);
      setPanelOpen(stored.panelOpen);
    } else {
      conversation.current = trimConversation(
        parseStoredConversation(sessionStorage.getItem("conversation")),
      );
      setLatestQuestion(
        [...conversation.current]
          .reverse()
          .find((message) => message.role === "user")?.content ?? null,
      );
    }
    setHydrated(true);

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
      socket.current?.close(1000, "Component unmounted");
      socket.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const snapshot = createAssistantSession({
      conversation: conversation.current,
      latestQuestion,
      assistantMessage: displayMessage,
      blocks,
      panelOpen,
    });
    sessionStorage.setItem(ASSISTANT_SESSION_KEY, JSON.stringify(snapshot));
    sessionStorage.setItem(
      "conversation",
      JSON.stringify(conversation.current),
    );
  }, [blocks, displayMessage, hydrated, latestQuestion, panelOpen]);

  const connectionLabel = {
    connecting: "Connecting",
    online: "Knowledge online",
    offline: "Browse mode",
  }[connection];

  return {
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
  };
};

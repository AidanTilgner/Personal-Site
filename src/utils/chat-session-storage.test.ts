import { describe, expect, test } from "bun:test";
import {
  ASSISTANT_SESSION_MAX_AGE,
  createAssistantSession,
  parseAssistantSession,
} from "./chat-session-storage";

const now = 2_000_000_000_000;

describe("assistant session storage", () => {
  test("round-trips a valid session", () => {
    const session = createAssistantSession(
      {
        conversation: [{ role: "user", content: "Show me the work" }],
        latestQuestion: "Show me the work",
        assistantMessage: "Here is the relevant work.",
        suggestions: ["What should I look at next?"],
        blocks: [
          {
            id: "projects",
            name: "projects",
            description: "Selected projects",
            content: { type: "raw", data: "<p>Projects</p>" },
          },
        ],
        panelOpen: true,
      },
      now,
    );

    expect(parseAssistantSession(JSON.stringify(session), now)).toEqual(
      session,
    );
  });

  test("rejects expired, future, and malformed sessions", () => {
    const valid = createAssistantSession(
      {
        conversation: [],
        latestQuestion: null,
        assistantMessage: "Hello",
        suggestions: [],
        blocks: [],
        panelOpen: false,
      },
      now,
    );

    expect(
      parseAssistantSession(
        JSON.stringify(valid),
        now + ASSISTANT_SESSION_MAX_AGE + 1,
      ),
    ).toBeUndefined();
    expect(
      parseAssistantSession(JSON.stringify(valid), now - 1),
    ).toBeUndefined();
    expect(parseAssistantSession('{"version":1}', now)).toBeUndefined();
    expect(parseAssistantSession("not json", now)).toBeUndefined();
  });

  test("restores older version-one snapshots without saved suggestions", () => {
    const stored = JSON.stringify({
      version: 1,
      conversation: [{ role: "user", content: "Show me the work" }],
      latestQuestion: "Show me the work",
      assistantMessage: "Here is the work.",
      blocks: [],
      panelOpen: true,
      updatedAt: now,
    });

    expect(parseAssistantSession(stored, now)?.suggestions).toEqual([]);
  });
});

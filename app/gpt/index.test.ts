import { describe, expect, test } from "bun:test";
import { createPreviewBlock } from "../blocks";
import type { KnowledgeMatch } from "../knowledge";
import { applyPreviewTuningOutput, parseFollowUpSuggestions } from ".";

const match: KnowledgeMatch = {
  document: {
    id: "project:example",
    sourceType: "project",
    path: "src/content/projects/example.md",
    title: "Example project",
    content: "An authored account of the example project.",
    aliases: ["example"],
    metadata: {
      description: "The canonical project description.",
      status: "active",
      tags: ["agents"],
    },
  },
  matchedContent: "An authored account of the example project.",
  score: 1,
  lexicalScore: 1,
};

describe("preview tuning", () => {
  test("reframes copy while preserving canonical identity and escaping HTML", () => {
    const preview = createPreviewBlock(match);
    if (!preview) throw new Error("Expected a preview block.");

    const [tuned] = applyPreviewTuningOutput(
      [preview],
      [match],
      JSON.stringify({
        previews: [
          {
            id: "project:example",
            relevance: "Relevant to <script>agent work</script>",
            summary: "A focused look at <strong>the authored project</strong>.",
          },
        ],
      }),
    );

    expect(tuned.name).toBe("Example project");
    expect(tuned.href).toBe("/projects/example");
    expect(tuned.content.data).toContain("Relevant to &lt;script&gt;agent work");
    expect(tuned.content.data).toContain(
      "A focused look at &lt;strong&gt;the authored project&lt;/strong&gt;.",
    );
    expect(tuned.content.data).toContain(">Example project</a>");
  });

  test("rejects tuning for an unselected source", () => {
    const preview = createPreviewBlock(match);
    if (!preview) throw new Error("Expected a preview block.");

    expect(() =>
      applyPreviewTuningOutput(
        [preview],
        [match],
        JSON.stringify({
          previews: [
            {
              id: "project:not-selected",
              relevance: "Untrusted framing",
              summary: "Untrusted summary",
            },
          ],
        }),
      ),
    ).toThrow("invalid copy");
  });
});

describe("follow-up suggestions", () => {
  test("accepts three distinct questions grounded by the generator", () => {
    const suggestions = [
      "Which decisions had the greatest impact?",
      "What tradeoffs did Aidan navigate?",
      "Which related project should I explore next?",
    ];

    expect(
      parseFollowUpSuggestions(
        JSON.stringify({ questions: suggestions }),
        ["What has Aidan built?"],
      ),
    ).toEqual(suggestions);
  });

  test("rejects repeated, duplicate, or incomplete questions", () => {
    expect(() =>
      parseFollowUpSuggestions(
        JSON.stringify({
          questions: [
            "What has Aidan built?",
            "Which work should I explore next?",
            "Which work should I explore next?",
          ],
        }),
        ["What has Aidan built?"],
      ),
    ).toThrow("invalid questions");

    expect(() =>
      parseFollowUpSuggestions(
        JSON.stringify({
          questions: [
            "Which decisions mattered most",
            "What tradeoffs did Aidan navigate?",
            "Which project should I explore next?",
          ],
        }),
        [],
      ),
    ).toThrow("invalid questions");
  });
});

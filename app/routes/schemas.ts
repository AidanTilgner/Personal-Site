import { t } from "elysia";

export const MessageSchema = t.Object({
  role: t.Union([t.Literal("assistant"), t.Literal("user")]),
  content: t.String({ minLength: 1, maxLength: 4_000 }),
});

export const ConversationSchema = t.Array(MessageSchema, {
  minItems: 1,
  maxItems: 20,
});

export const ChatRequestSchema = t.Object(
  {
    type: t.Literal("chat.request"),
    requestId: t.String({ minLength: 1, maxLength: 128 }),
    conversation: ConversationSchema,
  },
  { additionalProperties: false },
);

export const BlocksRequestSchema = t.Object(
  { conversation: ConversationSchema },
  { additionalProperties: false },
);

const BlockSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.String(),
  kind: t.Optional(
    t.Union([t.Literal("project-preview"), t.Literal("blog-preview")]),
  ),
  href: t.Optional(t.String()),
  content: t.Object({
    type: t.Union([t.Literal("raw"), t.Literal("url")]),
    data: t.String(),
  }),
  aliases: t.Optional(t.Array(t.String())),
});

export const ChatServerMessageSchema = t.Union([
  t.Object({
    type: t.Literal("content.blocks"),
    requestId: t.String(),
    blocks: t.Array(BlockSchema),
  }),
  t.Object({
    type: t.Literal("assistant.delta"),
    requestId: t.String(),
    index: t.Number(),
    text: t.String(),
  }),
  t.Object({
    type: t.Literal("assistant.done"),
    requestId: t.String(),
    message: t.String(),
  }),
  t.Object({
    type: t.Literal("assistant.suggestions"),
    requestId: t.String(),
    suggestions: t.Array(t.String({ minLength: 1, maxLength: 120 }), {
      maxItems: 4,
    }),
  }),
  t.Object({
    type: t.Literal("error"),
    requestId: t.String(),
    code: t.Union([
      t.Literal("INVALID_REQUEST"),
      t.Literal("RATE_LIMITED"),
      t.Literal("SERVER_BUSY"),
      t.Literal("MONTHLY_BUDGET_REACHED"),
      t.Literal("RESPONSE_GENERATION_FAILED"),
    ]),
    message: t.String(),
  }),
]);

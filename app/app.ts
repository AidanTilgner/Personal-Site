import { cors } from "@elysia/cors";
import { Elysia } from "elysia";
import {
  areBlocksReady,
  getBlock,
  getBlockFile,
  getBlocks,
  initializeBlocks,
  parseBlockContent,
} from "./blocks";
import { chatRoutes } from "./routes/chat";
import { BlocksRequestSchema } from "./routes/schemas";
import { getKnowledgeStatus } from "./knowledge";
import { getAllowedOrigins } from "./config/env";

export { getAllowedOrigins } from "./config/env";

const getBlockContent = async (id: string) => {
  const block = await getBlock(id);
  if (!block) return;
  const file = getBlockFile(`${block.name}.html`);
  if (!file) return;
  return parseBlockContent(file, block);
};

export const createApp = async () => {
  const allowedOrigins = getAllowedOrigins();
  await initializeBlocks();

  return new Elysia({
    websocket: {
      maxPayloadLength: 64 * 1024,
      idleTimeout: 60,
      backpressureLimit: 256 * 1024,
      closeOnBackpressureLimit: true,
    },
  })
    .use(
      cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
      }),
    )
    .onError(({ code, error, status }) => {
      if (code === "NOT_FOUND") {
        return status(404, { message: "Not found." });
      }
      if (code === "VALIDATION") {
        return status(400, {
          message: "Invalid request.",
          details: error.all.map((issue) => issue.summary),
        });
      }
      console.error("Unhandled server error.", error);
      return status(500, { message: "Internal server error." });
    })
    .get("/health", () => ({
      status: "ok",
      knowledgeReady: areBlocksReady(),
      knowledge: getKnowledgeStatus(),
    }))
    .post(
      "/v1/blocks/query",
      async ({ body }) => {
        const query = body.conversation.at(-1)?.content;
        const blocks = await getBlocks(query);
        return {
          message: "Successfully retrieved blocks!",
          data: { blocks },
        };
      },
      { body: BlocksRequestSchema },
    )
    .get("/v1/blocks/:id/content", async ({ params, status }) => {
      const content = await getBlockContent(params.id);
      if (!content) return status(404, "Block not found.");
      return new Response(content, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    })
    .use(chatRoutes(allowedOrigins));
};

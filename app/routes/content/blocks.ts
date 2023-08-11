import { Router } from "express";
import {
  getBlock,
  getBlockFile,
  getBlocks,
  parseBlockContent,
} from "../../blocks";
import { startBlockResponseStream } from "../../blocks/gpt";
import { getConnection } from "../socket-io";
import type { Message } from "../../../types/conversation";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const conversation = req.body.conversation as Message[];

    const socket_id = req.headers["x-socket-id"] as string | undefined;
    const query = conversation[conversation.length - 1].content;

    const blocks = await getBlocks(query);

    if (!socket_id || !query) {
      return res.send({
        message: "Successfully retrieved blocks!",
        data: { blocks },
      });
    }

    const socket = getConnection(socket_id);

    startBlockResponseStream(socket, blocks, conversation);

    res.send({
      message: "Successfully retrieved blocks!",
      data: { blocks },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/block-file/:filename", async (req, res) => {
  try {
    const file = getBlockFile(req.params.filename);
    const block_id = req.query.block_id as string | undefined;

    if (!block_id && block_id !== "fallback-block") {
      return res.status(400).send("No block ID.");
    }

    if (!file) {
      return res.status(404).send("File not found.");
    }

    const block = await getBlock(block_id);

    if (!block) {
      return res.status(404).send("Block not found.");
    }

    const parsedContent = await parseBlockContent(file, block);

    res.send(parsedContent);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      data: null,
    });
  }
});

export default router;

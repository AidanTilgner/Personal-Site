import { Router } from "express";
import {
  getBlock,
  getBlockFile,
  getBlocks,
  parseBlockContent,
} from "../../blocks";
import { startBlockResponseStream } from "../../blocks/gpt";
import { getConnection } from "../socket-io";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.query as string | undefined;
    const socket_id = req.headers["x-socket-id"] as string | undefined;

    console.log("Headers:", req.headers);
    console.log("Socket ID:", socket_id);

    const blocks = await getBlocks(query);

    if (!socket_id) {
      return res.send({
        message: "Successfully retrieved blocks!",
        data: { blocks },
      });
    }

    const socket = getConnection(socket_id);

    startBlockResponseStream(socket, blocks, [
      {
        role: "user",
        content: query,
      },
    ]);

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

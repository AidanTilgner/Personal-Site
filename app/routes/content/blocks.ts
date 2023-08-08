import { Router } from "express";
import { getBlocks } from "../../blocks";

const router = Router();

router.get("/", (req, res) => {
  try {
    const query = req.query.query as string | undefined;

    const blocks = getBlocks(query);

    res.send({
      message: "Successfully retrieved blocks!",
      data: blocks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      data: null,
    });
  }
});

export default router;

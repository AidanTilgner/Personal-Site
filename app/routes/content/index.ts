import { Router } from "express";
import blocksRouter from "./blocks";

const router = Router();

router.use("/blocks", blocksRouter);

export default router;

import { Router } from "express";

const router = Router();

router.post("/prompt", (req, res) => {
  res.send({
    message: "Successfully retrieved chat data!",
    data: {},
  });
});

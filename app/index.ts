import Express from "express";
import { config } from "dotenv";
import cors from "cors";
import contentRouter from "./routes/content";

config();

const PORT = process.env.SERVER_PORT || 8080;

const app = Express();

app.use(cors());

app.use("/content", contentRouter);

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});

import Express from "express";
import { config } from "dotenv";
import cors from "cors";
import contentRouter from "./routes/content";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

config();

const PORT = process.env.SERVER_PORT || 8080;

const app = Express();

app.use(cors());

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/content", contentRouter);
app.use(Express.static(path.join(__dirname, "./public")));

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});

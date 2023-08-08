import Express from "express";
import { config } from "dotenv";
import cors from "cors";

config();

const PORT = process.env.PORT || 3000;

const app = Express();

app.use(cors());

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});

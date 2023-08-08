import { dockStart } from "@nlpjs/basic";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

let manager: any = null;

export const train = async () => {
  const dock = await dockStart({
    use: ["Basic"],
  });
  const nlp = dock.get("nlp");
  nlp.settings.autoSave = false;
  nlp.settings.autoLoad = false;
  nlp.settings.log = false;
  await nlp.addCorpus(path.join(__dirname, "intents.json"));
  await nlp.train();
  manager = nlp;
  return nlp;
};

export const processQuery = async (query: string) => {
  if (!manager) {
    await train();
  }
  const response = await manager.process("en", query);
  return response;
};

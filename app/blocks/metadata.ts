import { getAllCorpusIntents, getAllWhenIntents } from "./nlp";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { format } from "prettier";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const generateMetaData = async () => {
  if (!fs.existsSync(path.join(__dirname, "metadata"))) {
    fs.mkdirSync(path.join(__dirname, "metadata"));
  }
  await generateIntentMetadata();
  return;
};

export const generateIntentMetadata = async () => {
  const intents = await getAllCorpusIntents();
  const when_intents = await getAllWhenIntents();

  const missing_when_intents = when_intents
    .filter((w) => !intents.includes(w))
    .filter((w, i, a) => a.indexOf(w) === i);

  // intents that are in the corpus but not in the when intents
  const missing_intents = intents
    .filter((w) => !when_intents.includes(w))
    .filter((w, i, a) => a.indexOf(w) === i);

  const metadata = {
    intents,
    when_intents,
    missing_when_intents,
    missing_intents,
  };

  fs.writeFileSync(
    path.join(__dirname, "metadata", "intent-data.json"),
    await format(JSON.stringify(metadata), { parser: "json" }),
  );

  fs.writeFileSync(
    path.join(__dirname, "metadata", "intents-to-add.txt"),
    missing_when_intents.length > 0
      ? [
          ...missing_when_intents.map((i) => `* ${i} is missing from corpus`),
          ...missing_intents.map((i) => `* ${i} is missing from blocks`),
        ].join("\n")
      : "No missing intents detected. Good job!",
  );

  if (missing_when_intents.length > 0) {
    console.warn(
      "Missing intents detected. These intents exist on blocks, but are not supported by the corpus. Missing intents: ",
      missing_when_intents,
    );
  }

  if (missing_intents.length > 0) {
    console.warn(
      "Missing intents detected. These intents exist in the corpus, but are not supported by blocks. Missing intents: ",
      missing_intents,
    );
  }

  return;
};

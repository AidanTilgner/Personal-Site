import {
  OpenAIApi,
  Configuration,
  CreateChatCompletionRequest,
} from "openai-edge";
import { OpenAIStream } from "ai";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export const getChatCompletionStream = async (
  messages: CreateChatCompletionRequest["messages"],
  model: CreateChatCompletionRequest["model"] = "gpt-3.5-turbo",
) => {
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      stream: true,
    });

    const stream = OpenAIStream(response);

    return {
      success: true,
      stream,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      stream: null,
    };
  }
};

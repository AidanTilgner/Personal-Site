import axios, { AxiosInstance } from "axios";

const { AIRTISAN_CHATBOT_URL, AIRTISAN_CHATBOT_API_KEY } = import.meta.env;

export const chatInstance: AxiosInstance = axios.create({
  baseURL:  AIRTISAN_CHATBOT_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": AIRTISAN_CHATBOT_API_KEY,
    "x-service": "personal-site",
  },
});

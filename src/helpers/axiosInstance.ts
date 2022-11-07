import axios, { AxiosInstance } from "axios";

const { ONYX_CHAT_URL, ONYX_CHAT_API_KEY } = import.meta.env;

export const chatInstance: AxiosInstance = axios.create({
  baseURL: ONYX_CHAT_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": ONYX_CHAT_API_KEY,
    "x-service": "portfolio",
  },
});

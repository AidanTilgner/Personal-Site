import axios, { AxiosInstance } from "axios";

const { ONYX_CHAT_URL } = import.meta.env;

export const chatInstance: AxiosInstance = axios.create({
  baseURL: ONYX_CHAT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

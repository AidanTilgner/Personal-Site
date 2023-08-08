import axios from "axios";

const backendURL = import.meta.env.PUBLIC_BACKEND_URL;

export const backend = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
});

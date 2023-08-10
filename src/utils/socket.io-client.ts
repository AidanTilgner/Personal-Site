import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL;

if (!BACKEND_URL)
  throw new Error(
    "BACKEND_URL is not defined, and required for socket connection.",
  );

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  upgrade: false,
});

export const getSocket = () => socket;

socket.on("connect", () => {
  console.info("Connected to socket.io server.");
});

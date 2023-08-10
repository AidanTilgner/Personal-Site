import type { Server, Socket } from "socket.io";

export const connections: Record<string, Socket> = {};

export const getConnection = (id: string) => connections[id];

export const getConnections = () => connections;

export const initSocketIOListeners = (io: Server) => {
  socketIOListeners.forEach(({ event, listener }) => {
    io.on(event, listener);
  });
};

export const socketIOListeners: {
  event: string;
  listener: (socket: Socket) => void;
}[] = [
  {
    event: "connection",
    listener: (s) => {
      console.info("A client connected.");
      connections[s.id] = s;
    },
  },
  {
    event: "disconnect",
    listener: (s) => {
      console.info("A client disconnected.");
      delete connections[s.id];
    },
  },
];

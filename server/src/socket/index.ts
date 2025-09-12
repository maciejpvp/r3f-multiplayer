import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { registerSocketHandlers } from "./handlers";

export function initSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
  });

  return io;
}

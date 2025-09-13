import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { registerSocketHandlers } from "./handlers";
import { initGameLoop } from "../game";

export async function initSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  // Init game world + loop
  await initGameLoop(io);

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
  });

  return io;
}

import { Server, Socket } from "socket.io";
import { PlayerInput } from "./types";
import { createPlayer, getPlayers, removePlayer } from "../game/Player";

export function registerSocketHandlers(io: Server, socket: Socket) {
  console.log(`🎮 Player connected: ${socket.id}`);

  const player = createPlayer(socket.id);

  console.log(player);

  socket.emit("currentPlayers", getPlayers());

  // socket.broadcast.emit("newPlayer", player);

  socket.on("updateInput", (input: PlayerInput) => {
    player.input = input;
  });

  socket.on("updateRotation", (rotation) => {
    console.log(rotation);
    player.rotation = rotation;
  });

  socket.on("disconnect", () => {
    console.log(`👋 Player disconnected: ${socket.id}`);
    removePlayer(socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
}

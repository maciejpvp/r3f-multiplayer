import { Server, Socket } from "socket.io";
import { PlayerInput } from "./types";
import { createPlayer, getPlayers, removePlayer } from "../game/Player";
import * as THREE from "three";

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
    // rotation = { x, y, z } in radians
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, "XYZ");
    const quat = new THREE.Quaternion().setFromEuler(euler);

    player.body.setRotation(
      {
        x: quat.x,
        y: quat.y,
        z: quat.z,
        w: quat.w,
      },
      true,
    );
  });

  socket.on("disconnect", () => {
    console.log(`👋 Player disconnected: ${socket.id}`);
    removePlayer(socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
}

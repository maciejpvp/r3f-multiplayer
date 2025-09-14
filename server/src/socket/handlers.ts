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
  socket.on("updateRotation", (quat) => {
    const q = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);

    // Convert to Euler to isolate yaw
    const euler = new THREE.Euler().setFromQuaternion(q, "YXZ");

    // Build a new quaternion with only yaw (ignore pitch/roll)
    const yawOnly = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, euler.y, 0, "YXZ"),
    );

    player.body.setRotation(
      {
        x: yawOnly.x,
        y: yawOnly.y,
        z: yawOnly.z,
        w: yawOnly.w,
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

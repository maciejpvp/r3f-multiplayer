import { Server, Socket } from "socket.io";
import { PlayerInput } from "./types";
import { createPlayer, getPlayers, removePlayer } from "../game/Player";
import * as THREE from "three";
import { handleBlockInteract } from "../game/actions/handleBlockInteract";

export function registerSocketHandlers(io: Server, socket: Socket) {
  console.log(`🎮 Player connected: ${socket.id}`);

  const player = createPlayer(socket.id);

  socket.emit("currentPlayers", getPlayers());

  socket.on("updateInput", (input: PlayerInput) => {
    player.input = input;
  });
  socket.on("updateRotation", (quat) => {
    const q = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);

    const euler = new THREE.Euler().setFromQuaternion(q, "YXZ");

    player.rotation = euler;

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

  socket.on("blockInteract", (data: { blockId: string | null }) => {
    console.log(data.blockId);
    handleBlockInteract(player.id, data.blockId);
  });

  socket.on("disconnect", () => {
    console.log(`👋 Player disconnected: ${socket.id}`);
    removePlayer(socket.id);
    handleBlockInteract(player.id, null);

    socket.broadcast.emit("playerDisconnected", socket.id);
  });
}

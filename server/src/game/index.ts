import RAPIER from "@dimforge/rapier3d-compat";
import { Server } from "socket.io";
import { setupWorld } from "./World";
import { setWorld, setIO, players, world, ioRef } from "./state";
import { MOVE_SPEED, JUMP_FORCE, TICK_RATE } from "./constants";
import * as THREE from "three";
import { getBlocks } from "./Block";
import { updateHeldBlocks } from "./actions/handleBlockInteract";

export async function initGameLoop(io: Server) {
  setIO(io);
  await RAPIER.init();

  const w = setupWorld();
  setWorld(w);

  setInterval(() => {
    // === Handle player movement ===
    for (const player of players.values()) {
      const body = player.body;

      // base movement vector (local space)
      const localVelocity = new THREE.Vector3(0, body.linvel().y, 0);

      if (player.input.forward) localVelocity.z -= MOVE_SPEED;
      if (player.input.backward) localVelocity.z += MOVE_SPEED;
      if (player.input.left) localVelocity.x -= MOVE_SPEED;
      if (player.input.right) localVelocity.x += MOVE_SPEED;

      // apply player rotation
      const rotation = body.rotation(); // RAPIER Quaternion
      const quat = new THREE.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w,
      );

      const worldVelocity = localVelocity.clone().applyQuaternion(quat);

      // jump check
      if (player.input.jump && Math.abs(body.linvel().y) < 0.01) {
        worldVelocity.y = JUMP_FORCE;
      }

      body.setLinvel(
        { x: worldVelocity.x, y: worldVelocity.y, z: worldVelocity.z },
        true,
      );
    }

    // === Step physics ===
    world.step();

    updateHeldBlocks();

    // === Collect players state ===
    const playersState = [...players.values()].map((p) => ({
      id: p.id,
      position: {
        x: p.body.translation().x,
        y: p.body.translation().y,
        z: p.body.translation().z,
      },
      rotation: {
        x: p.rotation.x,
        y: p.rotation.y,
        z: p.rotation.z,
      },
    }));

    // === Collect blocks state ===
    const blocksState = getBlocks();

    // === Send full state ===
    ioRef.emit("stateUpdate", {
      players: playersState,
      blocks: blocksState,
    });
  }, TICK_RATE);
}

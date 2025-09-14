import RAPIER from "@dimforge/rapier3d-compat";
import { Server } from "socket.io";
import { setupWorld } from "./World";
import { setWorld, setIO, players, world, ioRef } from "./state";
import { MOVE_SPEED, JUMP_FORCE, TICK_RATE } from "./constants";
import * as THREE from "three";

export async function initGameLoop(io: Server) {
  setIO(io);
  await RAPIER.init();

  const w = setupWorld();
  setWorld(w);

  setInterval(() => {
    for (const player of players.values()) {
      const body = player.body;

      // bazowy wektor ruchu w lokalnym układzie (WSAD)
      const localVelocity = new THREE.Vector3(0, body.linvel().y, 0);

      if (player.input.forward) localVelocity.z -= MOVE_SPEED;
      if (player.input.backward) localVelocity.z += MOVE_SPEED;
      if (player.input.left) localVelocity.x -= MOVE_SPEED;
      if (player.input.right) localVelocity.x += MOVE_SPEED;

      // pobierz rotację ciała jako kwaternion
      const rotation = body.rotation(); // RAPIER Quaternion { x, y, z, w }
      const quat = new THREE.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w,
      );

      // przekształć ruch względem rotacji body
      const worldVelocity = localVelocity.clone().applyQuaternion(quat);

      // skok
      if (player.input.jump && Math.abs(body.linvel().y) < 0.01) {
        worldVelocity.y = JUMP_FORCE;
      }

      body.setLinvel(
        { x: worldVelocity.x, y: worldVelocity.y, z: worldVelocity.z },
        true,
      );
    }

    world.step();

    const state = [...players.values()].map((p) => ({
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

    ioRef.emit("stateUpdate", state);
  }, TICK_RATE);
}

import RAPIER from "@dimforge/rapier3d-compat";
import { world, players } from "./state";
import { Player } from "../socket/types";

export function createPlayer(id: string): Player {
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, 1, 0)
    .lockRotations();
  const body = world.createRigidBody(rigidBodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.5);
  world.createCollider(colliderDesc, body);

  const player: Player = {
    id,
    body,
    input: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    },
    rotation: { x: 0, y: 0, z: 0 },
  };

  players.set(id, player);
  return player;
}

export function removePlayer(id: string) {
  players.delete(id);
}

export function getPlayers() {
  return [...players.values()].map((p) => ({
    id: p.id,
    position: {
      x: p.body.translation().x,
      y: p.body.translation().y,
      z: p.body.translation().z,
    },
    rotation: {
      x: p.body.rotation().x,
      y: p.body.rotation().y,
      z: p.body.rotation().z,
      w: p.body.rotation().w,
    },
  }));
}

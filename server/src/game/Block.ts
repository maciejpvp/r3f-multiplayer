import RAPIER from "@dimforge/rapier3d-compat";
import { blocks } from "./state";
import { Block } from "../socket/types";

export function createBlock(
  id: string,
  position: { x: number; y: number; z: number },
  world: RAPIER.World,
) {
  // Dynamic rigid body (movable)
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    position.x,
    position.y,
    position.z,
  );

  const body = world.createRigidBody(rigidBodyDesc);

  // Collider for a cube block
  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    .setRestitution(0.1) // a little bounciness
    .setFriction(0.7); // friction so it doesn’t slide too much

  world.createCollider(colliderDesc, body);

  const block: Block = { id, body };
  blocks.set(id, block);
  return block;
}

export function removeBlock(id: string) {
  blocks.delete(id);
}

export function getBlocks() {
  return [...blocks.values()].map((b) => ({
    id: b.id,
    position: {
      x: b.body.translation().x,
      y: b.body.translation().y,
      z: b.body.translation().z,
    },
    rotation: {
      x: b.body.rotation().x,
      y: b.body.rotation().y,
      z: b.body.rotation().z,
      w: b.body.rotation().w,
    },
  }));
}

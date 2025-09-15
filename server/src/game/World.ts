import RAPIER from "@dimforge/rapier3d-compat";
import { createBlock } from "./Block";

export function setupWorld(): RAPIER.World {
  const gravity = { x: 0, y: -9.81, z: 0 };
  const world = new RAPIER.World(gravity);

  // Floor
  const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -5, 0);
  const floorBody = world.createRigidBody(floorBodyDesc);

  const floorColliderDesc = RAPIER.ColliderDesc.cuboid(15, 5, 15);
  world.createCollider(floorColliderDesc, floorBody);

  //Blocks
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = 0.5;
    const z = (Math.random() - 0.5) * 20;
    createBlock(`block-${i}`, { x, y, z }, world);
  }

  world.integrationParameters.normalizedPredictionDistance = 0.2;
  world.integrationParameters.numSolverIterations = 8;

  return world;
}

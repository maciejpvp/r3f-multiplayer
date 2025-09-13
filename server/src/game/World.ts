import RAPIER from "@dimforge/rapier3d-compat";

export function setupWorld(): RAPIER.World {
  const gravity = { x: 0, y: -9.81, z: 0 };
  const world = new RAPIER.World(gravity);

  // Floor
  const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -5, 0);
  const floorBody = world.createRigidBody(floorBodyDesc);

  const floorColliderDesc = RAPIER.ColliderDesc.cuboid(5, 5, 5);
  world.createCollider(floorColliderDesc, floorBody);

  return world;
}

import { blocks, players } from "../state";
import RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";

const playerGrabs = new Map<string, string>();

export function handleBlockInteract(playerId: string, blockId: string | null) {
  releaseBlock(playerId);

  if (!blockId) return;

  const block = blocks.get(blockId);
  if (!block) return;

  block.body.setBodyType(RAPIER.RigidBodyType.KinematicVelocityBased, true);

  playerGrabs.set(playerId, blockId);
}

export function releaseBlock(playerId: string) {
  const blockId = playerGrabs.get(playerId);
  if (!blockId) return;

  const block = blocks.get(blockId);
  if (block) {
    block.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    block.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    block.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  playerGrabs.delete(playerId);
}

export function updateHeldBlocks() {
  for (const [playerId, blockId] of playerGrabs.entries()) {
    const player = players.get(playerId);
    const block = blocks.get(blockId);
    if (!player || !block) continue;

    block.body.wakeUp();

    const euler = new THREE.Euler(
      player.rotation.x,
      player.rotation.y,
      player.rotation.z,
      "YXZ",
    );
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();

    const distance = 2;
    const currentPos = block.body.translation();
    const targetPos = new THREE.Vector3(
      player.body.translation().x + forward.x * distance,
      player.body.translation().y + forward.y * distance + 1,
      player.body.translation().z + forward.z * distance,
    );

    const current = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const direction = targetPos.clone().sub(current);
    const speed = 10;
    const velocity = direction.multiplyScalar(speed);

    block.body.setLinvel({ x: velocity.x, y: velocity.y, z: velocity.z }, true);

    block.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }
}

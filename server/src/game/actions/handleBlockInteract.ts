import { blocks, players, world } from "../state";
import RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";

// Track which block each player is holding
const playerGrabs = new Map<string, string>(); // playerId -> blockId

export function handleBlockInteract(playerId: string, blockId: string | null) {
  // Release existing block
  releaseBlock(playerId);

  if (!blockId) return;

  const block = blocks.get(blockId);
  if (!block) return;

  // Make the block kinematic so it can be moved manually
  block.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);

  // Register as currently held
  playerGrabs.set(playerId, blockId);
}

export function releaseBlock(playerId: string) {
  const blockId = playerGrabs.get(playerId);
  if (!blockId) return;

  const block = blocks.get(blockId);
  if (block) {
    block.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true); // back to normal physics
  }

  playerGrabs.delete(playerId);
}

export function updateHeldBlocks() {
  for (const [playerId, blockId] of playerGrabs.entries()) {
    const player = players.get(playerId);
    const block = blocks.get(blockId);
    if (!player || !block) continue;

    // Convert camera Euler rotation to a forward vector
    const euler = new THREE.Euler(
      player.rotation.x,
      player.rotation.y,
      player.rotation.z,
      "YXZ",
    );
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();

    // Target position in front of camera
    const distance = 2; // how far the block should be
    const targetPos = {
      x: player.body.translation().x + forward.x * distance,
      y: player.body.translation().y + forward.y * distance + 1, // lift slightly
      z: player.body.translation().z + forward.z * distance,
    };

    // Move block kinematically
    block.body.setNextKinematicTranslation(targetPos);
  }
}

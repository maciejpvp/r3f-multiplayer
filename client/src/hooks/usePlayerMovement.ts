import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useSocket } from "../hooks/useSocket";

export function usePlayerMovement(
  body: React.RefObject<RapierRigidBody | null>,
  camera: THREE.Camera,
  keys: React.RefObject<Record<string, boolean>>,
) {
  const socketRef = useSocket();
  const direction = new THREE.Vector3();

  useFrame(() => {
    if (!body.current) return;

    const speed = 5;
    const velocity = new THREE.Vector3();

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const forward = direction.clone();
    const right = new THREE.Vector3()
      .crossVectors(camera.up, forward)
      .normalize()
      .negate();

    if (keys.current["KeyW"]) velocity.add(forward);
    if (keys.current["KeyS"]) velocity.sub(forward);
    if (keys.current["KeyA"]) velocity.sub(right);
    if (keys.current["KeyD"]) velocity.add(right);

    velocity.normalize().multiplyScalar(speed);

    const currentVel = body.current.linvel();
    body.current.setLinvel(
      { x: velocity.x, y: currentVel.y, z: velocity.z },
      true,
    );

    if (keys.current["Space"] && Math.abs(currentVel.y) < 0.05) {
      body.current.setLinvel({ x: velocity.x, y: 5, z: velocity.z }, true);
    }

    const pos = body.current.translation();
    camera.position.set(pos.x, pos.y + 1.5, pos.z);

    // Sync with server
    if (socketRef.current) {
      socketRef.current.emit("updateState", {
        position: [pos.x, pos.y, pos.z] as [number, number, number],
        rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z] as [
          number,
          number,
          number,
        ],
      });
    }
  });
}

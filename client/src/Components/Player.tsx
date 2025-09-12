import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { useKeyboard } from "../hooks/useKeyboard";
import { useMouseLook } from "../hooks/useMouseLook";
import { usePlayerMovement } from "../hooks/usePlayerMovement";

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const keys = useKeyboard();

  // Apply mouse look
  useMouseLook(camera);

  // Apply movement + server sync
  usePlayerMovement(body, camera, keys);

  return (
    <RigidBody
      ref={body}
      mass={1}
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      colliders={false}
    >
      <CapsuleCollider args={[0.5, 1]} />
      <mesh>
        <capsuleGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>
    </RigidBody>
  );
}

import React from "react";
import * as THREE from "three";

export type BlockProps = {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  color?: string;
};

export const Block: React.FC<BlockProps> = ({
  id,
  position,
  rotation,
  color = "orange",
}) => {
  const quat = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w,
  );

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      quaternion={quat}
      castShadow
      receiveShadow
      userData={{ id }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

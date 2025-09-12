import React from "react";
import { RigidBody, type RigidBodyProps } from "@react-three/rapier";

interface FloorProps extends RigidBodyProps {
  size?: [number, number, number];
  color?: string;
}

export const Floor: React.FC<FloorProps> = ({
  size = [10, 0.2, 10],
  color = "green",
  ...rigidBodyProps
}) => {
  return (
    <RigidBody type="fixed" {...rigidBodyProps}>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

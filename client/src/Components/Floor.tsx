import React from "react";

interface FloorProps {
  size?: [number, number, number];
  color?: string;
}

export const Floor: React.FC<FloorProps> = ({
  size = [30, 0.2, 30],
  color = "green",
}) => {
  return (
    <mesh receiveShadow position={[0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

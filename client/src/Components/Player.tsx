import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useKeyboard } from "../hooks/useKeyboard";
import { useMouseLook } from "../hooks/useMouseLook";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useSocketStore, type PlayerType } from "../store/socketStore";
import * as THREE from "three";
import { useGrabBlock } from "../hooks/useGrabBlock";

export function Player() {
  const { camera } = useThree();
  const keys = useKeyboard();
  const { socket } = useSocketStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const holding = useGrabBlock();

  // Mouse look only affects camera
  useMouseLook(camera);

  // Handle inputs → emit to server
  usePlayerMovement(keys);

  // Listen for authoritative updates
  useEffect(() => {
    if (!socket) return;

    socket.on("stateUpdate", (state) => {
      const players: PlayerType[] = state.players;
      const me = players.find((p) => p.id === socket!.id);
      if (me && meshRef.current) {
        // Update mesh
        meshRef.current.position.set(
          me.position.x,
          me.position.y,
          me.position.z,
        );
        meshRef.current.quaternion.set(
          me.rotation.x,
          me.rotation.y,
          me.rotation.z,
          me.rotation.w,
        );

        camera.position.set(me.position.x, me.position.y + 1, me.position.z);
      }
    });

    return () => {
      socket?.off("stateUpdate");
    };
  }, [socket, camera]);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="blue" wireframe />
    </mesh>
  );
}

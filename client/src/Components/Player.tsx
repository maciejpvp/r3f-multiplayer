import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { useKeyboard } from "../hooks/useKeyboard";
import { useMouseLook } from "../hooks/useMouseLook";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useSocketStore, type PlayerType } from "../store/socketStore";

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const keys = useKeyboard();
  const { socket } = useSocketStore();

  // Mouse look only affects camera
  useMouseLook(camera);

  // Handle inputs → emit to server
  usePlayerMovement(keys);

  // Listen for authoritative updates
  useEffect(() => {
    if (!socket) return;

    socket.on("stateUpdate", (players: PlayerType[]) => {
      const me = players.find((p) => p.id === socket!.id);
      if (me && body.current) {
        console.log(me.position.y);
        body.current.setTranslation(me.position, true);
        body.current.setRotation(me.rotation, true);

        // Camera follows
        camera.position.set(me.position.x, me.position.y + 1.5, me.position.z);
      }
    });

    return () => {
      socket?.off("stateUpdate");
    };
  }, [socket, camera]);

  return (
    <RigidBody
      ref={body}
      mass={1}
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

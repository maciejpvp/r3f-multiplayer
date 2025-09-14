import { useEffect, useState } from "react";
import * as THREE from "three";
import { useSocketStore, type PlayerType } from "../store/socketStore";

export function OtherPlayers() {
  const socket = useSocketStore((store) => store.socket);
  const [players, setPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleStateUpdate = (playersData: PlayerType[]) => {
      const otherPlayers = playersData.filter((p) => p.id !== socket.id);
      setPlayers(otherPlayers);
    };

    socket.on("stateUpdate", handleStateUpdate);

    return () => {
      socket.off("stateUpdate", handleStateUpdate);
    };
  }, [socket]);

  return (
    <>
      {players.map((p) => {
        const euler = new THREE.Euler(
          p.rotation.x,
          p.rotation.y,
          p.rotation.z,
          "XYZ",
        );

        // Body quaternion only uses Y (yaw)
        const bodyEuler = new THREE.Euler(0, euler.y, 0, "XYZ");
        const bodyQuat = new THREE.Quaternion().setFromEuler(bodyEuler);

        // Head quaternion uses X (pitch) and Z (roll) **locally**, no premultiply
        const headEuler = new THREE.Euler(euler.x, 0, euler.z, "XYZ");
        const headQuat = new THREE.Quaternion().setFromEuler(headEuler);

        // Walking animation factor
        const walkSpeed = 2;
        const walkPhase = p.position.z * walkSpeed;
        const limbSwing = (Math.sin(walkPhase) * Math.PI) / 6;

        return (
          <group
            key={p.id}
            position={[p.position.x, p.position.y, p.position.z]}
          >
            {/* Body + limbs group */}
            <group quaternion={bodyQuat}>
              {/* Body */}
              <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[1, 1, 0.7]} />
                <meshStandardMaterial color="red" />
              </mesh>

              {/* Head */}
              <mesh quaternion={headQuat} position={[0, 1.05, 0]}>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="blue" />
              </mesh>

              {/* Left Arm */}
              <mesh position={[-0.65, 0.2, 0]} rotation={[limbSwing, 0, 0]}>
                <boxGeometry args={[0.3, 1, 0.3]} />
                <meshStandardMaterial color="yellow" />
              </mesh>

              {/* Right Arm */}
              <mesh position={[0.65, 0.2, 0]} rotation={[-limbSwing, 0, 0]}>
                <boxGeometry args={[0.3, 1, 0.3]} />
                <meshStandardMaterial color="yellow" />
              </mesh>

              {/* Left Leg */}
              <mesh position={[-0.3, -0.5, 0]} rotation={[-limbSwing, 0, 0]}>
                <boxGeometry args={[0.4, 0.5, 0.4]} />
                <meshStandardMaterial color="yellow" />
              </mesh>

              {/* Right Leg */}
              <mesh position={[0.3, -0.5, 0]} rotation={[limbSwing, 0, 0]}>
                <boxGeometry args={[0.4, 0.5, 0.4]} />
                <meshStandardMaterial color="yellow" />
              </mesh>
            </group>
          </group>
        );
      })}
    </>
  );
}

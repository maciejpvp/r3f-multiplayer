import { useEffect, useState } from "react";
import { useSocketStore, type PlayerType } from "../store/socketStore";

export function OtherPlayers() {
  const socket = useSocketStore((store) => store.socket);
  const [players, setPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleStateUpdate = (playersData: PlayerType[]) => {
      setPlayers(playersData);
    };

    socket.on("stateUpdate", handleStateUpdate);

    return () => {
      socket.off("stateUpdate", handleStateUpdate);
    };
  }, [socket]);

  return (
    <>
      {players.map((p) => (
        <mesh
          key={p.id}
          position={[p.position.x, p.position.y, p.position.z]}
          // Apply rotation from quaternion
          ref={(mesh) => {
            if (mesh) {
              mesh.quaternion.set(
                p.rotation.x,
                p.rotation.y,
                p.rotation.z,
                p.rotation.w,
              );
            }
          }}
        >
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
    </>
  );
}

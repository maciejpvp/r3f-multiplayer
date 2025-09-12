import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface PlayerState {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export function OtherPlayers() {
  const socketRef = useSocket();
  const [players, setPlayers] = useState<Record<string, PlayerState>>({});

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on("currentPlayers", (p: Record<string, PlayerState>) => {
      setPlayers(p);
    });

    socket.on("newPlayer", (player: PlayerState) => {
      setPlayers((prev) => ({ ...prev, [player.id]: player }));
    });

    socket.on("playerMoved", (player: PlayerState) => {
      setPlayers((prev) => ({ ...prev, [player.id]: player }));
    });

    socket.on("playerDisconnected", (id: string) => {
      setPlayers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });

    return () => {
      socket.off("currentPlayers");
      socket.off("newPlayer");
      socket.off("playerMoved");
      socket.off("playerDisconnected");
    };
  }, [socketRef]);

  return (
    <>
      {Object.values(players).map((p) => (
        <mesh key={p.id} position={p.position}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
    </>
  );
}

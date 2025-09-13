import { useFrame } from "@react-three/fiber";
import { useSocketStore } from "../store/socketStore";

export function usePlayerMovement(
  keys: React.RefObject<Record<string, boolean>>,
) {
  const { socket } = useSocketStore();

  useFrame(() => {
    if (!socket) return;

    // Collect input state
    const input = {
      forward: !!keys.current["KeyW"],
      backward: !!keys.current["KeyS"],
      left: !!keys.current["KeyA"],
      right: !!keys.current["KeyD"],
      jump: !!keys.current["Space"],
    };

    // Send inputs to server
    socket.emit("updateInput", input);
  });
}

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboard } from "./useKeyboard";
import { useBlockInteraction } from "./useBlockInteraction";
import { useSocketStore } from "../store/socketStore";

export function useGrabBlock() {
  const keys = useKeyboard();
  const blockId = useBlockInteraction(); // ID of block under crosshair
  const socket = useSocketStore((s) => s.socket);

  const [holding, setHolding] = useState<string | null>(null);
  const prevE = useRef(false);

  useFrame(() => {
    const ePressed = keys.current["KeyE"];

    // Edge trigger: just pressed this frame
    if (ePressed && !prevE.current) {
      if (holding) {
        // Release currently held block
        socket?.emit("blockInteract", { blockId: null });
        setHolding(null);
      } else if (blockId) {
        // Grab block under crosshair
        socket?.emit("blockInteract", { blockId });
        setHolding(blockId);
      }
    }

    prevE.current = ePressed;
  });

  return holding; // currently held block ID
}

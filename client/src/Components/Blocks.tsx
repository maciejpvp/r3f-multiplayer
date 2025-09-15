import { useEffect, useState } from "react";
import { Block } from "./Block";
import { useSocketStore, type BlockType } from "../store/socketStore";

export function Blocks() {
  const socket = useSocketStore((s) => s.socket);
  const [blocks, setBlocks] = useState<BlockType[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("stateUpdate", (state) => {
      setBlocks(state.blocks);
    });

    return () => {
      socket.off("stateUpdate");
    };
  }, [socket]);

  return (
    <>
      {blocks.map((b) => (
        <Block key={b.id} {...b} />
      ))}
    </>
  );
}

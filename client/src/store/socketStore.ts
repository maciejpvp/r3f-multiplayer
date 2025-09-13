import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export type PlayerType = {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
};

// Server events
type ServerToClientEvents = {
  stateUpdate: (players: PlayerType[]) => void; // replace `any` with your Player type
  newPlayer: (player: PlayerType) => void;
  playerDisconnected: (playerId: string) => void;
};

// Client events
type ClientToServerEvents = {
  updateInput: (data: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  }) => void;

  updateRotation: (data: {
    x: number; // pitch
    y: number; // yaw
    z: number; // roll (usually 0)
  }) => void;
};

export type GameSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null;

type SocketStore = {
  socket: GameSocket;
  connect: () => void;
  disconnect: () => void;
};

let socketInstance: GameSocket = null; // singleton

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,

  connect: () => {
    if (socketInstance) {
      set({ socket: socketInstance });
      return;
    }

    const socket = io(
      `${import.meta.env.VITE_BACKEND || "http://localhost:3000"}`,
    );

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.onAny((event, ...args) => {
      console.log(`📥 Received event: "${event}"`, ...args);
    });

    socketInstance = socket;
    set({ socket });
  },

  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      set({ socket: null });
    }
  },
}));

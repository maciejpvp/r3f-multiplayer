export type Player = {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

export const players: Record<string, Player> = {};

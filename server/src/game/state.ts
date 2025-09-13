import RAPIER from "@dimforge/rapier3d-compat";
import { Server } from "socket.io";
import { Player } from "../socket/types";

export let ioRef: Server;
export let world: RAPIER.World;
export const players = new Map<string, Player>();

export function setIO(io: Server) {
  ioRef = io;
}
export function setWorld(w: RAPIER.World) {
  world = w;
}

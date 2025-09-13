import RAPIER from "@dimforge/rapier3d-compat";

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface Player {
  id: string;
  body: RAPIER.RigidBody;
  input: PlayerInput;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

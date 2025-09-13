import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { type Camera } from "@react-three/fiber";
import { useSocketStore } from "../store/socketStore";

export function useMouseLook(camera: Camera) {
  const socket = useSocketStore((store) => store.socket);
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);

  useEffect(() => {
    if (!socket) return;

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return;
      euler.setFromQuaternion(camera.quaternion);
      euler.y -= e.movementX * 0.002;
      euler.x -= e.movementY * 0.002;
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      camera.quaternion.setFromEuler(euler);

      socket.emit("updateRotation", {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z,
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("click", () => {
      document.body.requestPointerLock();
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [socket, camera, euler]);
}

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { type Camera } from "@react-three/fiber";

export function useMouseLook(camera: Camera) {
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return;
      euler.setFromQuaternion(camera.quaternion);
      euler.y -= e.movementX * 0.002;
      euler.x -= e.movementY * 0.002;
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      camera.quaternion.setFromEuler(euler);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("click", () => {
      document.body.requestPointerLock();
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [camera, euler]);
}

import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useState } from "react";

export function useBlockInteraction(): string | null {
  const { camera, scene } = useThree();
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [mouse] = useState(() => new THREE.Vector2(0, 0)); // środek ekranu
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);

    // Wszystkie obiekty w scenie
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      setFocusedBlockId(obj.userData.id || null);
    } else {
      setFocusedBlockId(null);
    }
  });

  return focusedBlockId;
}

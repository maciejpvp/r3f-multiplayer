import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Floor } from "./Components/Floor";
import { Player } from "./Components/Player.tsx";
import { Suspense, useEffect } from "react";
import { OtherPlayers } from "./Components/OtherPlayers.tsx";
import { useSocketStore } from "./store/socketStore.ts";

export default function App() {
  const { connect } = useSocketStore();
  useEffect(() => {
    connect();
  }, []);

  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ position: [0, 2, 5], fov: 60 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["lightblue"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense>
        <Physics>
          <Floor />
          <Player />
          {/* <OtherPlayers /> */}
        </Physics>
      </Suspense>
    </Canvas>
  );
}

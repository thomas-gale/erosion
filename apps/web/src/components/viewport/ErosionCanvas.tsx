import { ReactReduxContext } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { useContextBridge, Sky } from "@react-three/drei";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { Chunk } from "./terrain/Chunk";
import { config } from "../../env/config";
import { Gizmo } from "./debug/Gizmo";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <directionalLight position={[20, 50, 20]} />
        <ambientLight intensity={0.75} />
        <PerspectiveControlledCamera />
        <Gizmo />
        <Chunk seed={config.testSeed} x={0} y={-16} z={0} size={32} />
        <Chunk seed={config.testSeed} x={32} y={-16} z={0} size={32} />
        <Chunk seed={config.testSeed} x={32} y={-16} z={32} size={32} />
        <Chunk seed={config.testSeed} x={0} y={-16} z={32} size={32} />
      </ContextBridge>
    </Canvas>
  );
};

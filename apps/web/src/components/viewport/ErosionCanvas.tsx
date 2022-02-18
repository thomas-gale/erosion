import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Sky } from "@react-three/drei";
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

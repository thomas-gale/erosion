import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Gizmo } from "./debug/Gizmo";
import { Sky } from "./terrain/Sky";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { Chunk } from "./terrain/Chunk";
import { config } from "../../env/config";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <PerspectiveControlledCamera />
        <Gizmo />
        <Chunk seed={config.testSeed} x={0} y={0} z={-16} size={32} />
        <Chunk seed={config.testSeed} x={32} y={0} z={-16} size={32} />
        <Chunk seed={config.testSeed} x={32} y={32} z={-16} size={32} />
        <Chunk seed={config.testSeed} x={0} y={32} z={-16} size={32} />
      </ContextBridge>
    </Canvas>
  );
};

import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Gizmo } from "./debug/Gizmo";
import { Sky } from "./terrain/Sky";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { Chunk } from "./terrain/Chunk";
import { FlatTerrain } from "./terrain/FlatTerrain";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <PerspectiveControlledCamera />
        <Gizmo />
        <FlatTerrain />
        <Chunk x={0} y={0} z={0} size={32} />
      </ContextBridge>
    </Canvas>
  );
};

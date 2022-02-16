import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Gizmo } from "./debug/gizmo";
import { Sky } from "./terrain/sky";
import { PerspectiveControlledCamera } from "./camera/perspectiveControlledCamera";
import { FlatTerrain } from "./terrain/flatTerrain";
import { TestCube } from "./player/testCube";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <PerspectiveControlledCamera />
        <FlatTerrain />
        <TestCube />
        <Gizmo />
      </ContextBridge>
    </Canvas>
  );
};

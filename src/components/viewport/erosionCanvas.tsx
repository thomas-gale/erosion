import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Gizmo } from "./debug/gizmo";
import { Sky } from "./terrain/sky";
import { OrthoControlledCamera } from "./camera/orthoControlledCamera";
import { FlatTerrain } from "./terrain/flatTerrain";
import { TestCube } from "./player/testCube";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <OrthoControlledCamera />
        <FlatTerrain />
        <TestCube />
        <Gizmo />
      </ContextBridge>
    </Canvas>
  );
};

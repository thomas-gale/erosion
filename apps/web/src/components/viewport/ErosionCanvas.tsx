import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Gizmo } from "./debug/Gizmo";
import { Sky } from "./terrain/Sky";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { FlatTerrain } from "./terrain/FlatTerrain";
import { TestCube } from "./player/TestCube";
import { TestSphere } from "./terrain/TestSphere";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <PerspectiveControlledCamera />
        <FlatTerrain />
        <TestSphere />
        <TestCube />
        <Gizmo />
      </ContextBridge>
    </Canvas>
  );
};

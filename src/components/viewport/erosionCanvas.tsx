import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { Sky } from "./terrain/sky";
import { OrthoMapControlledCamera } from "./camera/orthoMapControlledCamera";
import { FlatTerrain } from "./terrain/flatTerrain";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <Sky />
        <OrthoMapControlledCamera />
        <FlatTerrain />
      </ContextBridge>
    </Canvas>
  );
};

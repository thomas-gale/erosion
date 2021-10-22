import { Canvas } from "@react-three/fiber";
import { useContextBridge } from "@react-three/drei";
import { ReactReduxContext } from "react-redux";
import { FlatTerrain } from "./terrain/flatTerrain";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);
  return (
    <Canvas>
      <ContextBridge>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <FlatTerrain />
      </ContextBridge>
    </Canvas>
  );
};

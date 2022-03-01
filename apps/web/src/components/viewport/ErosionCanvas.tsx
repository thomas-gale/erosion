import { ReactReduxContext } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { useContextBridge, Sky } from "@react-three/drei";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { MapControls as MapControlsImpl } from "three-stdlib";
import { Gizmo } from "./debug/Gizmo";
import { useRef } from "react";
import { Terrain } from "./terrain/Terrain";
import { useGetClosestChunk } from "../../hooks/terrain/useGetClosestChunk";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);

  const mapControls = useRef<MapControlsImpl>();
  const nearestChunk = useGetClosestChunk(mapControls);

  return (
    <Canvas>
      <ContextBridge>
        <Sky sunPosition={[0.5, 1, 0]} />
        <directionalLight position={[20, 50, 20]} />
        <ambientLight intensity={0.75} />
        <PerspectiveControlledCamera mapControls={mapControls} />
        <Terrain nearestChunk={nearestChunk} />
        <Gizmo />
      </ContextBridge>
    </Canvas>
  );
};

import { useRef, useState } from "react";
import { ReactReduxContext } from "react-redux";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useContextBridge, Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { useGetClosestChunk } from "../../hooks/terrain/useGetClosestChunk";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { MapControls as MapControlsImpl } from "three-stdlib";
import { Gizmo } from "./debug/Gizmo";
import { Terrain } from "./terrain/Terrain";
import Digger from "./player/Digger_v1_static";

export const ErosionCanvas = () => {
  const ContextBridge = useContextBridge(ReactReduxContext);

  const mapControls = useRef<MapControlsImpl>();
  const nearestChunk = useGetClosestChunk(mapControls);

  const [sunPosition] = useState<THREE.Vector3>(
    () => new THREE.Vector3(0.5, 1, 0)
  );

  return (
    <Canvas>
      <ContextBridge>
        <Physics>
          <Sky sunPosition={sunPosition} />
          <directionalLight position={sunPosition} />
          <ambientLight intensity={0.75} />
          <PerspectiveControlledCamera mapControls={mapControls} />
          <Digger position={[0, 10, 0]} />
          <Terrain nearestChunk={nearestChunk} sunPosition={sunPosition} />
          <Gizmo />
        </Physics>
      </ContextBridge>
    </Canvas>
  );
};

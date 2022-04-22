import { useRef, useState } from "react";
import { ReactReduxContext } from "react-redux";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useContextBridge, Sky } from "@react-three/drei";
import { Debug, Physics } from "@react-three/cannon";
import { useGetClosestChunk } from "../../hooks/terrain/useGetClosestChunk";
import { PerspectiveControlledCamera } from "./camera/PerspectiveControlledCamera";
import { MapControls as MapControlsImpl } from "three-stdlib";
import { Gizmo } from "./debug/Gizmo";
import { Terrain } from "./terrain/Terrain";
import { Digger } from "./player/Digger";
import { PhySphere } from "./debug/PhySphere";
import { PhyPlane } from "./debug/PhyPlane";

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
          <Debug color="black" scale={1.1}>
            <Sky sunPosition={sunPosition} />
            <directionalLight position={sunPosition} />
            <ambientLight intensity={0.75} />
            <PerspectiveControlledCamera mapControls={mapControls} />
            {/* <Terrain nearestChunk={nearestChunk} sunPosition={sunPosition} /> */}
            <PhyPlane position={[0, 2, 0]} />
            <PhySphere position={[11, 10, 10]} />
            <Digger position={[10, 15, 10]} />
            <Gizmo />
          </Debug>
        </Physics>
      </ContextBridge>
    </Canvas>
  );
};

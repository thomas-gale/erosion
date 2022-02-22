import { MapControls, PerspectiveCamera } from "@react-three/drei";
import { MutableRefObject } from "react";
import { MapControls as MapControlsImpl } from "three-stdlib";

export interface PerspectiveControlledCameraProps {
  mapControls: MutableRefObject<MapControlsImpl>;
}

export const PerspectiveControlledCamera = ({
  mapControls,
}: PerspectiveControlledCameraProps) => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 50, 0]}
        up={[0, 1, 0]}
        zoom={1}
      />
      <MapControls
        panSpeed={1}
        rotateSpeed={1}
        zoomSpeed={1}
        minDistance={5}
        maxDistance={100}
        target={[16, 0, 16]}
        maxPolarAngle={Math.PI / 4}
        ref={mapControls}
      />
    </>
  );
};

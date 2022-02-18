import { MapControls, PerspectiveCamera } from "@react-three/drei";

export const PerspectiveControlledCamera = () => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[-25, 50, -25]}
        up={[0, 1, 0]}
        zoom={1}
      />
      <MapControls
        panSpeed={1}
        rotateSpeed={1}
        zoomSpeed={1}
        minDistance={5}
        maxDistance={100}
        target={[32, 0, 32]}
        // maxPolarAngle={Math.PI / 4}
      />
    </>
  );
};

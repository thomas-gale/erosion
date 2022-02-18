import { MapControls, PerspectiveCamera } from "@react-three/drei";

export const PerspectiveControlledCamera = () => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        // position={[0, 10, 10]}
        position={[-25, -25, 50]}
        up={[0, 0, 1]}
        zoom={1}
      />
      <MapControls
        panSpeed={2}
        rotateSpeed={1}
        zoomSpeed={1}
        minDistance={5}
        maxDistance={100}
        target={[32, 32, 0]}
        // maxPolarAngle={Math.PI / 4}
      />
    </>
  );
};

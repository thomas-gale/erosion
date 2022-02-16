import { MapControls, PerspectiveCamera } from "@react-three/drei";

export const PerspectiveControlledCamera = () => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 10, 10]}
        up={[0, 0, 1]}
        zoom={1}
      />
      <MapControls
        panSpeed={1}
        rotateSpeed={1}
        zoomSpeed={1}
        minDistance={5}
        maxDistance={20}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 4}
      />
    </>
  );
};

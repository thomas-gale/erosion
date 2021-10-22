import { MapControls, OrthographicCamera } from "@react-three/drei";

export const OrthoControlledCamera = () => {
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[0, 10, 10]}
        up={[0, 0, 1]}
        zoom={40}
      />
      <MapControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 4} />
    </>
  );
};

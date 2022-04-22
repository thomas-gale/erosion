import { PlaneProps, usePlane } from "@react-three/cannon";
import { useRef } from "react";
import { Mesh } from "three";

export const PhyPlane = ({
  position,
  ...props
}: Pick<PlaneProps, "position">) => {
  const [ref] = usePlane(
    () => ({ position, rotation: [-Math.PI / 2, 0, 0], ...props }),
    useRef<Mesh>(null)
  );
  return (
    <mesh ref={ref}>
      <planeGeometry args={[1000, 1000]} />
    </mesh>
  );
};

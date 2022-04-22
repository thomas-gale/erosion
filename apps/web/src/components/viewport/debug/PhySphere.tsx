import { useRef } from "react";
import { SphereProps, useSphere } from "@react-three/cannon";
import { Mesh } from "three";
import { TorusKnot } from "@react-three/drei";

export const PhySphere = ({
  args = [2],
  position,
}: Pick<SphereProps, "args" | "position">) => {
  const [ref] = useSphere(
    () => ({ args, mass: 1, position }),
    useRef<Mesh>(null)
  );
  const [radius] = args;
  return (
    <TorusKnot ref={ref} args={[radius / 2, radius / 2]}>
      <meshNormalMaterial />
    </TorusKnot>
  );
};

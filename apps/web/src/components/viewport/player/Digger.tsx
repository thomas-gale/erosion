import { useRef } from "react";
import type { Mesh } from "three";
import { useBox, BoxProps } from "@react-three/cannon";
import DiggerModel from "./Digger_v1_static";

export const Digger = ({ position, ...props }: BoxProps) => {
  const [ref] = useBox(
    () => ({
      args: [2.5, 2.5, 5],
      mass: 10,
      position,
      ...props,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref} dispose={null}>
      <DiggerModel position={[0, -1, 0.5]} />
    </mesh>
  );
};

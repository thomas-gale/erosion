import { useRef } from "react";
import type { Vector3 } from "three";
import { Group } from "three";
import { useBox, BoxProps } from "@react-three/cannon";
import DiggerModel from "./Digger_v1_static";

export const Digger = ({ position, ...props }: BoxProps) => {
  const [ref] = useBox(
    () => ({
      arg: [15, 15, 15],
      mass: 10,
      position,
      ...props,
    }),
    useRef<Group>(null)
  );

  return <DiggerModel ref={ref} />;
};

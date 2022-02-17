import { Vector3 } from "three";

export const basicDistanceFunction = (position: Vector3) => {
  return position.z < 0 ? 1 : 0;
};

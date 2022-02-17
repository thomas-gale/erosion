import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Terrain } from "engine";

export const TestSphere = () => {
  const sphereMesh = useRef<THREE.Mesh>();
  useEffect(() => {
    const terrain = new Terrain();
    sphereMesh.current = terrain.generateRedTestSphere();
  }, []);
  return (
    <group>
      <mesh ref={sphereMesh} />
    </group>
  );
};

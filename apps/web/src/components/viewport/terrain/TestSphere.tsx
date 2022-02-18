import { useEffect, useRef, useState } from "react";
import { Terrain } from "engine";

export const TestSphere = () => {
  const verts = useRef<Float32Array>();
  const tris = useRef<Uint32Array>();

  const [sphereReady, setSphereReady] = useState(false);
  useEffect(() => {
    const terrain = new Terrain();
    const testSphere = terrain.generateTestSphere();

    verts.current = new Float32Array(testSphere.positions.flat());
    tris.current = new Uint32Array(testSphere.cells.flat());

    setSphereReady(true);
  }, []);
  return (
    <group position={[1, 1, 1]} scale={[0.2, 0.2, 0.2]}>
      {sphereReady && (
        <mesh>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="index"
              array={tris.current}
              count={tris.current.length}
              itemSize={1}
            />
            <bufferAttribute
              attachObject={["attributes", "position"]}
              count={verts.current.length / 3}
              array={verts.current}
              itemSize={3}
            />
          </bufferGeometry>
          <meshBasicMaterial attach="material" wireframe color="pink" />
        </mesh>
      )}
    </group>
  );
};

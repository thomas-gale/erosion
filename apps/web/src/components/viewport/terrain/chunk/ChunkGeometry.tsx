import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./ChunkMaterial";

export interface ChunkGeometryProps {
  verts: Float32Array;
  cells: Uint32Array;
}

export const ChunkGeometry = ({ verts, cells }: ChunkGeometryProps) => {
  const geomRef = useRef<THREE.BufferGeometry>();
  const [lightVector] = useState<THREE.Vector3>(
    () => new THREE.Vector3(-1, -1, 0)
  );

  // Ensure that the geometry triggers a re-render if the verts of cells change.
  useEffect(() => {
    if (geomRef.current) {
      geomRef.current.index.needsUpdate = true;
      geomRef.current.attributes.position.needsUpdate = true;
      geomRef.current.computeVertexNormals();
    }
  }, [verts, cells]);

  useEffect(() => {
    console.log("Re-rendering chunk geometry...");
  }, []);

  return (
    <>
      {verts && cells && (
        <mesh>
          <bufferGeometry attach="geometry" ref={geomRef}>
            <bufferAttribute
              attach="index"
              array={cells}
              count={cells.length}
              itemSize={1}
            />
            <bufferAttribute
              attachObject={["attributes", "position"]}
              array={verts}
              count={verts.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <chunkMaterial attach="material" lightVector={lightVector} />
        </mesh>
      )}
    </>
  );
};

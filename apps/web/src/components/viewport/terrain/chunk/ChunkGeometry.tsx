import { useEffect, useRef } from "react";

export interface ChunkGeometryProps {
  verts: Float32Array;
  numVerts: number;
  cells: Uint32Array;
  numCells: number;
}

export const ChunkGeometry = ({
  verts,
  numVerts,
  cells,
  numCells,
}: ChunkGeometryProps) => {
  const geomRef = useRef<THREE.BufferGeometry>();

  // Ensure that the geometry triggers a re-render if the verts of cells change.
  useEffect(() => {
    if (geomRef.current) {
      geomRef.current.index.needsUpdate = true;
      geomRef.current.attributes.position.needsUpdate = true;
      geomRef.current.computeVertexNormals();
    }
  }, [verts, cells]);

  return (
    <>
      {verts && cells && (
        <mesh>
          <bufferGeometry attach="geometry" ref={geomRef}>
            <bufferAttribute
              attach="index"
              array={cells}
              count={numCells}
              itemSize={1}
            />
            <bufferAttribute
              attachObject={["attributes", "position"]}
              array={verts}
              count={numVerts / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial attach="material" wireframe color="green" />
        </mesh>
      )}
    </>
  );
};

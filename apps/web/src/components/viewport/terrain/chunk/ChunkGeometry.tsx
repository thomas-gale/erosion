import { useEffect, useRef } from "react";

export interface ChunkGeometryProps {
  verts: Float32Array;
  cells: Uint32Array;
}

export const ChunkGeometry = ({ verts, cells }: ChunkGeometryProps) => {
  const geomRef = useRef<THREE.BufferGeometry>();

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
          <meshStandardMaterial attach="material" wireframe color="green" />
        </mesh>
      )}
    </>
  );
};

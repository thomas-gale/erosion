import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./ChunkMaterial";

export interface ChunkGeometryProps {
  verts: Float32Array;
  vertsMetadata: Float32Array;
  vertsMetadataStride: number;
  cells: Uint32Array;
}

export const ChunkGeometry = ({
  verts,
  vertsMetadata,
  vertsMetadataStride,
  cells,
}: ChunkGeometryProps) => {
  const geomRef = useRef<THREE.BufferGeometry>();
  // TODO - share with the sunPosition on the Sky box component in the parent canvas component.
  const [sunPosition] = useState<THREE.Vector3>(
    () => new THREE.Vector3(0.5, 1, 0)
  );

  // Ensure that the geometry triggers a re-render if the verts of cells change.
  useEffect(() => {
    if (geomRef.current) {
      geomRef.current.index.needsUpdate = true;
      geomRef.current.attributes.position.needsUpdate = true;
      geomRef.current.attributes.metadata.needsUpdate = true;
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
            <bufferAttribute
              attachObject={["attributes", "metadata"]}
              array={vertsMetadata}
              count={vertsMetadata.length / vertsMetadataStride}
              itemSize={vertsMetadataStride}
            />
          </bufferGeometry>
          <chunkMaterial attach="material" sunPosition={sunPosition} />
        </mesh>
      )}
    </>
  );
};

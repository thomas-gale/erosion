import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ChunkMaterial";

export interface ChunkGeometryProps {
  verts: Float32Array;
  vertsMetadata: Float32Array;
  vertsMetadataStride: number;
  cells: Uint32Array;
  sunPosition: THREE.Vector3;
}

export const ChunkGeometry = ({
  verts,
  vertsMetadata,
  vertsMetadataStride,
  cells,
  sunPosition,
}: ChunkGeometryProps) => {
  const geomRef = useRef<THREE.BufferGeometry>();

  // Ensure that the geometry triggers a re-render if the verts of cells change.
  useEffect(() => {
    if (geomRef.current) {
      geomRef.current.index.needsUpdate = true;
      geomRef.current.attributes.position.needsUpdate = true;
      geomRef.current.attributes.metadata.needsUpdate = true;
      geomRef.current.computeVertexNormals();
    }
  }, [verts, cells, vertsMetadata]);

  useEffect(() => {
    console.log("Re-rendering chunk geometry...");
  }, []);

  return (
    <>
      {verts?.length > 0 && vertsMetadata?.length > 0 && cells?.length > 0 && (
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

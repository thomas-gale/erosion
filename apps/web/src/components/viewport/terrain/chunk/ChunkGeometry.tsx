import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ChunkMaterial";

export interface ChunkGeometryProps {
  verts: Float32Array;
  vertsNum: number;
  vertsMetadata: Float32Array;
  vertsMetadataStride: number;
  vertsMetadataNum: number;
  cells: Uint32Array;
  cellsNum: number;
  sunPosition: THREE.Vector3;
}

export const ChunkGeometry = ({
  verts,
  vertsNum,
  vertsMetadata,
  vertsMetadataStride,
  vertsMetadataNum,
  cells,
  cellsNum,
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

  // Debug
  // useEffect(() => {
  //   console.log("Re-rendering chunk geometry...");
  //   console.log(cells?.length);
  //   console.log(cellsNum);
  //   console.log(vertsMetadata?.length);
  //   console.log(vertsMetadataNum);
  //   console.log(verts?.length);
  //   console.log(vertsNum);
  // }, [cells, cellsNum, verts, vertsMetadata, vertsMetadataNum, vertsNum]);

  return (
    <>
      {cells?.length > 0 &&
        cellsNum > 0 &&
        vertsMetadata?.length > 0 &&
        vertsMetadataNum > 0 &&
        verts?.length > 0 && (
          <mesh>
            <bufferGeometry attach="geometry" ref={geomRef}>
              <bufferAttribute
                attach="index"
                array={cells}
                count={cellsNum}
                itemSize={1}
              />
              <bufferAttribute
                attach="attributes-position"
                array={verts}
                count={verts.length / 3}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-metadata"
                array={vertsMetadata}
                count={vertsMetadataNum / vertsMetadataStride}
                itemSize={vertsMetadataStride}
              />
            </bufferGeometry>
            <chunkMaterial attach="material" sunPosition={sunPosition} />
          </mesh>
        )}
    </>
  );
};

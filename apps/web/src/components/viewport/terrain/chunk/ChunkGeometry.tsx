import { TrimeshProps, useHeightfield, useTrimesh } from "@react-three/cannon";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { Mesh } from "three";
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
  // Add contact surface for physics

  // NOT WORKING

  // Heightfield probably isn't what we want. rather a generic mesh collider.
  // Check that the problem isn't to empty triangles from the oversize pow2 array buffers for verts and cells.

  // const triMeshCtr = useCallback(() => {
  //   if (verts?.length > 0 && cells?.length > 0) {
  //     return {
  //       args: [
  //         verts.subarray(0, vertsNum - 1),
  //         cells.subarray(0, cellsNum - 1),
  //       ],
  //       position: [0, 0, 0],
  //     };
  //   }
  //   return {
  //     args: [
  //       [0, 0, 0, 1.5, 0, 0, 0, 1, 0],
  //       [0, 1, 2],
  //     ],
  //     position: [0, 20, 0],
  //   };
  // }, [verts, vertsNum, cells, cellsNum]);

  const triMesh = useCallback<(index: number) => TrimeshProps>(
    () => (index: number) => {
      // if (verts?.length > 0 && cells?.length > 0) {
      //   return {
      //     args: [
      //       verts.subarray(0, vertsNum - 1),
      //       cells.subarray(0, cellsNum - 1),
      //     ],
      //     position: [0, 0, 0],
      //   };
      // }
      console.log("Default trimesh used");
      return {
        args: [
          [0, 0, 0, 1.5, 0, 0, 0, 1, 0], // San check
          [0, 1, 2],
        ],
        position: [0, 20, 0],
      };
    },
    []
  );
  // }, [verts, vertsNum, cells, cellsNum]);

  const [ref] = useTrimesh(triMesh, useRef<Mesh>(null), []);

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
        verts?.length > 0 &&
        vertsNum > 0 && (
          <mesh ref={ref}>
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
                count={vertsNum / 3}
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

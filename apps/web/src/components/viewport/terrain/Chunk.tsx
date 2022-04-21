import { useEffect, useState } from "react";
import {
  LoadChunkMeshPayload,
  MeshResponse,
  TerrainInputData,
  TerrainPostMessageEvent,
} from "../../../engine/terrain.worker";
import { ChunkGeometry } from "./chunk/ChunkGeometry";

export interface ChunkProps {
  terrainWorker: Worker;
  xMin: number;
  zMin: number;
  xMax: number;
  zMax: number;
  padding: number;
  sunPosition: THREE.Vector3;
}

// Each chunk has its own web worker - to make callback worker easier (TODO - check if this is a problem!)
export const Chunk = ({
  terrainWorker,
  xMin,
  zMin,
  xMax,
  zMax,
  padding,
  sunPosition,
}: ChunkProps) => {
  const [verts, setVerts] = useState<Float32Array>();
  const [vertsNum, setVertsNum] = useState(0);
  const [vertsMetadata, setVertsMetadata] = useState<Float32Array>();
  const [vertsMetadataStride, setVertsMetadataStride] = useState<number>(0);
  const [vertsMetadataNum, setVertsMetadataNum] = useState(0);
  const [cells, setCells] = useState<Uint32Array>();
  const [cellsNum, setCellsNum] = useState(0);

  // Trigger load mesh when limits change
  useEffect(() => {
    (async () => {
      console.log(`Triggering web worker mesh for ${xMin}, ${zMin}...`);
      await terrainWorker.postMessage({
        type: "loadMesh",
        payload: {
          xMin: xMin - padding,
          zMin: zMin - padding,
          xMax: xMax + padding,
          zMax: zMax + padding,
        },
      } as TerrainInputData);
      console.log(`Triggered web worker mesh for ${xMin}, ${zMin}!`);
    })();
  }, [padding, terrainWorker, xMax, xMin, zMax, zMin]);

  // Configure the callback for loaded mesh
  useEffect(() => {
    terrainWorker.addEventListener(
      "message",
      async (event: TerrainPostMessageEvent) => {
        if (
          event.data.type === "loadMesh" ||
          event.data.type === "erodeMesh" ||
          event.data.type === "depositMesh"
        ) {
          const args = event.data.args as LoadChunkMeshPayload;
          // Only update if the event relates to this chunk
          // TODO - refactor this nasty padding based check
          if (
            args.xMin === xMin - padding &&
            args.zMin === zMin - padding &&
            args.xMax === xMax + padding &&
            args.zMax === zMax + padding
          ) {
            const resp = event.data.payload as MeshResponse;
            console.log(
              `Loading terrain mesh for x${xMin}:${xMax}, z${zMin}:${zMax}...`
            );
            setVerts(resp.verts);
            setVertsNum(resp.vertsNum);
            setVertsMetadata(resp.vertsMetadata);
            setVertsMetadataStride(resp.vertsMetadataStride);
            setVertsMetadataNum(resp.vertsMetadataNum);
            setCells(resp.cells);
            setCellsNum(resp.cellsNum);
            console.log(
              `Loaded terrain mesh for x${xMin}:${xMax}, z${zMin}:${zMax}!`
            );
          }
        }
      }
    );
  }, [padding, terrainWorker, xMax, xMin, zMax, zMin]);

  return (
    <ChunkGeometry
      key={`${verts?.length ?? 0}-${vertsMetadata?.length ?? 0}-${
        cells?.length ?? 0
      }`} // Trigger a re-render if the verts/vertsmetadata/cells Array length change (buffer geometry requires this)
      verts={verts}
      vertsNum={vertsNum}
      vertsMetadata={vertsMetadata}
      vertsMetadataStride={vertsMetadataStride}
      vertsMetadataNum={vertsMetadataNum}
      cells={cells}
      cellsNum={cellsNum}
      sunPosition={sunPosition}
    />
  );
};

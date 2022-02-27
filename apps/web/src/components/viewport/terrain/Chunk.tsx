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
}

// Each chunk has its own web worker - to make callback worker easier (TODO - check if this is a problem!)
export const Chunk = ({
  terrainWorker,
  xMin,
  zMin,
  xMax,
  zMax,
}: ChunkProps) => {
  const [verts, setVerts] = useState<Float32Array>();
  const [cells, setCells] = useState<Uint32Array>();

  // Trigger load mesh when limits change
  useEffect(() => {
    (async () => {
      console.log(`Triggering web worker mesh for ${xMin}, ${zMin}...`);
      await terrainWorker.postMessage({
        type: "loadMesh",
        payload: {
          xMin,
          zMin,
          xMax,
          zMax,
        },
      } as TerrainInputData);
      console.log(`Triggered web worker mesh for ${xMin}, ${zMin}!`);
    })();
  }, [terrainWorker, xMax, xMin, zMax, zMin]);

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
          // **TODO only update if the event relates to this chunk
          if (
            args.xMin === xMin &&
            args.zMin === zMin &&
            args.xMax === xMax &&
            args.zMax === zMax
          ) {
            console.log("Updated mesh from this chunk!");
          }

          const resp = event.data.payload as MeshResponse;
          console.log(
            `Loading terrain mesh for x${xMin}:${xMax}, z${zMin}:${zMax}...`
          );
          setVerts(resp.verts);
          setCells(resp.cells);
          console.log(
            `Loaded terrain mesh for x${xMin}:${xMax}, z${zMin}:${zMax}!`
          );
        }
      }
    );
  }, [terrainWorker, xMax, xMin, zMax, zMin]);

  return (
    <ChunkGeometry
      key={`${verts?.length ?? 0}-${cells?.length ?? 0}`} // Trigger a re-render if the verts/cells Array length change (buffer geometry requires this)
      cells={cells}
      verts={verts}
    />
  );
};

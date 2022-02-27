import { useEffect, useState } from "react";
import {
  LoadMeshResponse,
  TerrainInputData,
  TerrainPostMessageEvent,
} from "../../../engine/terrain.worker";
import { ChunkGeometry } from "./chunk/ChunkGeometry";

const upperPow2 = (x: number): number => {
  return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
};

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
  // const terrainWorker = useRef<Worker>();
  const [verts, setVerts] = useState<Float32Array>();
  const [cells, setCells] = useState<Uint32Array>();
  const [numVerts, setNumVerts] = useState<number>(0);
  const [numCells, setNumCells] = useState<number>(0);

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
        if (event.data.type === "loadMesh") {
          const resp = event.data.payload as LoadMeshResponse;
          console.log(
            `Loading terrain mesh for x${xMin}:${xMax}, z${zMin}:${zMax}...`
          );

          // DEBUG
          const verts = resp.positions.flat();
          const cells = resp.cells.flat();

          console.log("number verts", verts.length);
          console.log("number cells", cells.length);

          console.log("expanding verts", upperPow2(verts.length));
          console.log("expanding cells", upperPow2(cells.length));

          const vertsArray = new Float32Array(upperPow2(verts.length));
          vertsArray.set(verts);

          const cellsArray = new Uint32Array(upperPow2(cells.length));
          cellsArray.set(cells);

          setVerts(vertsArray);
          setCells(cellsArray);

          setNumVerts(verts.length);
          setNumCells(cells.length);

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
      numCells={numCells}
      verts={verts}
      numVerts={numVerts}
    />
  );
};

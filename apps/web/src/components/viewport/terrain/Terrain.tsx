import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useEffect, useMemo, useState } from "react";
import {
  InitResponse,
  TerrainInputData,
  TerrainPostMessageEvent,
} from "../../../engine/terrain.worker";

export interface TerrainProps {
  nearestChunk: {
    x: number;
    z: number;
  };
}

export const Terrain = ({
  nearestChunk: { x, z },
}: TerrainProps): JSX.Element => {
  /* 
  Notes.
  Move the terrain engine worker back here?
  Or keep the terrain engine workers in the chunks?

  create a higher order filtered callback in the mapping function which will tell the chunks when to re-render (and will provide update mesh)
  */

  // const terrainWorker = useRef<Worker>();

  // Load terrain worker and register callbacks

  // Using the nearest chunk to the camera focus, we can determine the chunks to render (this approximation relies on the camera elevation having a finite limit (of 45 degrees) - the chunk region is a hardcoded heuristic.)
  // TODO - change this to a spiral about the point: https://stackoverflow.com/questions/3706219/algorithm-for-iterating-over-an-outward-spiral-on-a-discrete-2d-grid-from-the-or
  // const chunkCoordsToLoad = useMemo(() => {
  //   console.log(x, z);
  //   const chunkCoords: { x: number; z: number }[] = [];

  //   // Naive approach for loading rings of chunks around the camera.
  //   for (let r = 0; r <= config.chunksToLoadAroundCamera; r++) {
  //     for (let i = x - r; i <= x + r; i++) {
  //       for (let j = z - r; j <= z + r; j++) {
  //         if (i == x - r || j == z - r || i == x + r || j == z + r) {
  //           chunkCoords.push({
  //             x: i * config.chunkSize,
  //             z: j * config.chunkSize,
  //           });
  //         }
  //       }
  //     }
  //   }
  //   return chunkCoords;
  // }, [x, z]);

  const [terrainWorker] = useState<Worker>(
    new Worker(new URL("../../../engine/terrain.worker", import.meta.url))
  );
  const [terrainWorkerInitialized, setTerrainWorkerInitialized] =
    useState(false);

  useEffect(() => {
    if (!terrainWorkerInitialized) {
      // Configure the callback
      terrainWorker.addEventListener(
        "message",
        async (event: TerrainPostMessageEvent) => {
          if (event.data.type === "init") {
            const resp = event.data.payload as InitResponse;
            // Now trigger the loadMesh
            if (resp) {
              console.log(`Terrain worker initialized!`);
              setTerrainWorkerInitialized(true);
            } else {
              console.warn("Error web worker init response:", resp);
            }
          }
        }
      );

      (async () => {
        console.log(`Triggering web worker init...`);
        await terrainWorker.postMessage({
          type: "init",
          payload: { seed: config.testSeed },
        } as TerrainInputData);
        console.log(`Triggered web worker init!`);
      })();
    }
  }, [terrainWorker, terrainWorkerInitialized]);

  return (
    <>
      {terrainWorkerInitialized && (
        <Chunk
          // key={`${x}-${z}`}
          // seed={config.testSeed}
          terrainWorker={terrainWorker}
          xMin={(x - 2) * config.chunkSize}
          zMin={(z - 2) * config.chunkSize}
          xMax={(x + 2) * config.chunkSize}
          zMax={(z + 2) * config.chunkSize}
        />
      )}
    </>
  );
};

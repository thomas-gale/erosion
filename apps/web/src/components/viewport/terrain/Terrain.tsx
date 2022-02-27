import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useEffect, useState } from "react";
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
  const [terrainWorker] = useState<Worker>(
    new Worker(new URL("../../../engine/terrain.worker", import.meta.url))
  );
  const [terrainWorkerInitialized, setTerrainWorkerInitialized] =
    useState(false);

  // Initialize the terrain worker
  useEffect(() => {
    if (!terrainWorkerInitialized) {
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

  // On unmount, terminate the worker
  useEffect(() => {
    return () => {
      console.log(`Terminating terrain web worker...`);
      setTerrainWorkerInitialized(false);
      terrainWorker.terminate();
    };
  }, [terrainWorker]);

  return (
    <>
      {terrainWorkerInitialized && (
        <Chunk
          terrainWorker={terrainWorker}
          xMin={(x - 2) * config.chunkSize}
          zMin={(z - 2) * config.chunkSize}
          xMax={(x + 3) * config.chunkSize}
          zMax={(z + 3) * config.chunkSize}
        />
      )}
    </>
  );
};

import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useEffect, useMemo, useState } from "react";
import {
  DepositMeshPayload,
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
  const xMin = useMemo(() => (x - 2) * config.chunkSize, [x]);
  const zMin = useMemo(() => (z - 2) * config.chunkSize, [z]);
  const xMax = useMemo(() => (x + 3) * config.chunkSize, [x]);
  const zMax = useMemo(() => (z + 3) * config.chunkSize, [z]);

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

  // TESTING -  Deposit Test (a little pillar :D)
  useEffect(() => {
    (async () => {
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        terrainWorker.postMessage({
          type: "depositMesh",
          payload: {
            chunk: { xMin, zMin, xMax, zMax },
            x: 0,
            y: 0 + i,
            z: 0,
          } as DepositMeshPayload,
        } as TerrainInputData);
      }
    })();
  }, [terrainWorker, xMax, xMin, zMax, zMin]);

  return (
    <>
      {terrainWorkerInitialized && (
        <Chunk
          terrainWorker={terrainWorker}
          xMin={xMin}
          zMin={zMin}
          xMax={xMax}
          zMax={zMax}
        />
      )}
    </>
  );
};

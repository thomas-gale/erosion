import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useEffect, useMemo, useState } from "react";
import {
  DepositMeshPayload,
  InitResponse,
  LoadChunkMeshPayload,
  TerrainInputData,
  TerrainPostMessageEvent,
} from "../../../engine/terrain.worker";

export interface TerrainProps {
  nearestChunk: {
    x: number;
    z: number;
  };
  sunPosition: THREE.Vector3;
}

export const Terrain = ({
  nearestChunk: { x, z },
  sunPosition,
}: TerrainProps): JSX.Element => {
  const chunkCoordsToLoad = useMemo(() => {
    console.log(x, z);
    const chunkCoords: LoadChunkMeshPayload[] = [];

    // Naive approach for loading rings of chunks around the camera.
    for (let r = 0; r <= config.chunksToLoadAroundCamera; r++) {
      for (let i = x - r; i <= x + r; i++) {
        for (let j = z - r; j <= z + r; j++) {
          if (i == x - r || j == z - r || i == x + r || j == z + r) {
            chunkCoords.push({
              xMin: i * config.chunkSize,
              zMin: j * config.chunkSize,
              xMax: i * config.chunkSize + config.chunkSize,
              zMax: j * config.chunkSize + config.chunkSize,
            });
          }
        }
      }
    }
    return chunkCoords;
  }, [x, z]);

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

  // **TESTING -  Deposit/Erode Test
  useEffect(() => {
    (async () => {
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        terrainWorker.postMessage({
          type: "depositMesh",
          payload: {
            // TODO - make this more elegant (if deposit is within the padding of a neighboring chunk, request a remesh of that chunk also)
            chunk: {
              xMin: 0 - config.chunkPadding,
              zMin: 0 - config.chunkPadding,
              xMax: config.chunkSize + config.chunkPadding,
              zMax: config.chunkSize + config.chunkPadding,
            },
            x: 16,
            y: 0 + i,
            z: 16,
          } as DepositMeshPayload,
        } as TerrainInputData);

        terrainWorker.postMessage({
          type: "erodeMesh",
          payload: {
            // TODO - make this more elegant (if deposit is within the padding of a neighboring chunk, request a remesh of that chunk also)
            chunk: {
              xMin: 0 - config.chunkPadding,
              zMin: 0 - config.chunkPadding,
              xMax: config.chunkSize + config.chunkPadding,
              zMax: config.chunkSize + config.chunkPadding,
            },
            x: 20,
            y: 16 - i,
            z: 20,
          } as DepositMeshPayload,
        } as TerrainInputData);
      }
    })();
  }, [terrainWorker]);

  return (
    <>
      {terrainWorkerInitialized &&
        chunkCoordsToLoad.map(({ xMin, zMin, xMax, zMax }) => (
          <Chunk
            key={`${xMin}-${xMax}-${zMin}-${zMax}`}
            terrainWorker={terrainWorker}
            xMin={xMin}
            zMin={zMin}
            xMax={xMax}
            zMax={zMax}
            padding={config.chunkPadding}
            sunPosition={sunPosition}
          />
        ))}
    </>
  );
};

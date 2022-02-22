import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Terrain as TerrainEngine } from "engine";
import {
  InitResponse,
  LoadMeshResponse,
  TerrainInputData,
  TerrainOutputData,
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
  const [terrainEngine] = useState<TerrainEngine>(
    () => new TerrainEngine(config.testSeed)
  );
  const terrainWorker = useRef<Worker>();

  const chunkCoordsToLoad = useMemo(() => {
    console.log(x, z);
    const chunkCoords: { x: number; z: number }[] = [];
    for (
      let i = x - config.chunksToLoadAroundCamera;
      i <= x + config.chunksToLoadAroundCamera;
      i++
    ) {
      for (
        let j = z - config.chunksToLoadAroundCamera;
        j <= z + config.chunksToLoadAroundCamera;
        j++
      ) {
        chunkCoords.push({ x: i * config.chunkSize, z: j * config.chunkSize });
      }
    }
    return chunkCoords;
  }, [x, z]);

  // Test making web worker
  useEffect(() => {
    console.log("Starting web worker");
    terrainWorker.current = new Worker(
      new URL("../../../engine/terrain.worker", import.meta.url)
    );
    // Test responding web worker
    terrainWorker.current.onmessage = (evt: TerrainPostMessageEvent) => {
      if (evt.data.type === "init") {
        const resp = evt.data.payload as InitResponse;
        console.log("WebWorker init Response => ", resp);
      } else if (evt.data.type === "loadMesh") {
        const resp = evt.data.payload as LoadMeshResponse;
        console.log("WebWorker load mesh Response => ", resp);
      }
    };
    return () => {
      terrainWorker.current.terminate();
    };
  }, []);

  // Test sending message to web worker
  useEffect(() => {
    (async () => {
      console.log("Triggering web worker init in 5s");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log("Triggering web worker init");
      await terrainWorker.current.postMessage({
        type: "init",
        payload: { seed: config.testSeed },
      } as TerrainInputData);
      console.log("Triggering web worker mesh");
      await terrainWorker.current.postMessage({
        type: "loadMesh",
        payload: {
          xMin: -10,
          zMin: -10,
          xMax: 10,
          zMax: 10,
        },
      } as TerrainInputData);
    })();
  }, []);

  return (
    <>
      {chunkCoordsToLoad.map(({ x, z }) => (
        <Chunk
          key={`${x}-${z}`}
          engine={terrainEngine}
          xMin={x - config.chunkPadding}
          zMin={z - config.chunkPadding}
          xMax={x + config.chunkSize + config.chunkPadding}
          zMax={z + config.chunkSize + config.chunkPadding}
        />
      ))}
    </>
  );
};

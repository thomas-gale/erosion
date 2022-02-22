import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Terrain as TerrainEngine } from "engine";
import { TerrainData } from "../../../engine/terrain.worker";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tsWorkerRef = useRef<any>();

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
    tsWorkerRef.current = new Worker(
      new URL("../../../engine/terrain.worker", import.meta.url)
    );
    // Test responding web worker
    tsWorkerRef.current.onmessage = (evt) =>
      console.log("WebWorker Response => ", evt.data);
    return () => {
      tsWorkerRef.current.terminate();
    };
  }, []);

  // Test sending message to web worker
  useEffect(() => {
    (async () => {
      console.log("Triggering web worker init in 5s");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log("Triggering web worker init");
      await tsWorkerRef.current.postMessage({
        type: "init",
        payload: { seed: config.testSeed },
      } as TerrainData);
      console.log("Triggering web worker mesh");
      await tsWorkerRef.current.postMessage({
        type: "loadMesh",
        payload: {
          xMin: -10,
          zMin: -10,
          xMax: 10,
          zMax: 10,
        },
      } as TerrainData);
    })();
  }, []);

  return (
    <>
      {chunkCoordsToLoad.map(({ x, z }, i) => (
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

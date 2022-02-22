import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Terrain as TerrainEngine } from "engine";

// TEST
import { Html } from "@react-three/drei";

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

  // Test web worker
  useEffect(() => {
    console.log("Starting web worker");
    tsWorkerRef.current = new Worker(
      new URL("../../../engine/terrain.worker", import.meta.url)
    );
    tsWorkerRef.current.onmessage = (evt) =>
      alert(`WebWorker Response => ${evt.data}`);
    return () => {
      tsWorkerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    (async () => {
      console.log("Triggering web worker calculation in 5s");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log("Triggering web worker calculation");
      await tsWorkerRef.current.postMessage(100000);
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

import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGetClosestChunk } from "../../../hooks/terrain/useGetClosestChunk";

import { Terrain as TerrainEngine } from "engine";

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

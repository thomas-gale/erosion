import { Chunk } from "./Chunk";
import { config } from "../../../env/config";
import { useMemo } from "react";

export interface TerrainProps {
  nearestChunk: {
    x: number;
    z: number;
  };
}

export const Terrain = ({
  nearestChunk: { x, z },
}: TerrainProps): JSX.Element => {
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
      {chunkCoordsToLoad.map(({ x, z }) => (
        <Chunk
          key={`${x}-${z}`}
          seed={config.testSeed}
          xMin={x - config.chunkPadding}
          zMin={z - config.chunkPadding}
          xMax={x + config.chunkSize + config.chunkPadding}
          zMax={z + config.chunkSize + config.chunkPadding}
        />
      ))}
    </>
  );
};

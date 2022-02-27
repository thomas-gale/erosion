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

  return (
    <>
      {/* {chunkCoordsToLoad.map(({ x, z }) => ( */}
      <Chunk
        // key={`${x}-${z}`}
        seed={config.testSeed}
        xMin={(x - 2) * config.chunkSize}
        zMin={(z - 2) * config.chunkSize}
        xMax={(x + 2) * config.chunkSize}
        zMax={(z + 2) * config.chunkSize}
      />
      {/* ))} */}
    </>
  );
};

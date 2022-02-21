import { MutableRefObject, useEffect, useState } from "react";
import { MapControls as MapControlsImpl } from "three-stdlib";
import { config } from "../../env/config";

// Returns the nearest chunk to map controls, polls at a pretty low frequency.
export const useGetClosestChunk = (
  mapControls: MutableRefObject<MapControlsImpl>
) => {
  const [nearestChunk, setNearestChunk] = useState({ x: 0, z: 0 });

  useEffect(() => {
    const check = async () => {
      let nearestChunk = { x: 0, z: 0 };
      while (true) {
        if (mapControls.current) {
          const target = mapControls.current.target;
          const nearestXChunk = Math.floor(target.x / config.chunkSize);
          const nearestZChunk = Math.floor(target.z / config.chunkSize);
          if (
            nearestXChunk !== nearestChunk.x ||
            nearestZChunk !== nearestChunk.z
          ) {
            nearestChunk = { x: nearestXChunk, z: nearestZChunk };
            setNearestChunk({ x: nearestXChunk, z: nearestZChunk });
          }
        }
        await new Promise((resolve) =>
          setTimeout(resolve, config.chunkCheckRateMs)
        );
      }
    };
    check();
  }, [mapControls]);

  return nearestChunk;
};

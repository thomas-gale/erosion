import { useEffect, useRef } from "react";
import { PointOctree } from "sparse-octree";
import * as noise from "../../algorithm/noise/perlin";
import { useAppDispatch } from "../state";
import { setGenerating } from "../../state/terrain/terrainSlice";
import { Block } from "../../types/terrain/block";
import { Vector3 } from "three";

const useGenerateTerrainOctree = (min_m: Vector3, max_m: Vector3) => {
  const dispatch = useAppDispatch();
  const terrainTree = useRef<PointOctree<Block> | null>(null);

  useEffect(() => {
    const generate = async () => {
      if (terrainTree.current) {
        console.log("tree already exists");
        return;
      }
      dispatch(setGenerating(true));

      // Initialise the terrain tree
      console.log("initialising the terrain octree");

      terrainTree.current = new PointOctree<Block>(min_m, max_m);

      // Compute the noise of the terrain
      console.log("computing the noise of the terrain");
      const step = 1;
      for (let x = min_m.x; x < max_m.x; x += step) {
        for (let y = min_m.y; y < max_m.y; y += step) {
          for (let z = min_m.z; z < max_m.z; z += step) {
            const noiseValue = noise.perlin3(
              (x - min_m.x) / (max_m.x - min_m.x),
              (y - min_m.y) / (max_m.y - min_m.y),
              (z - min_m.z) / (max_m.z - min_m.z)
            );
            // Assign terrain block to the tree
            terrainTree.current.set(new Vector3(x, y, z), {
              density: noiseValue,
              ore: "none",
            });
          }
        }
      }

      dispatch(setGenerating(false));
    };
    generate();
  }, [dispatch]);

  return terrainTree;
};

export default useGenerateTerrainOctree;

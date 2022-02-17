import { useState } from "react";
import { Vector3 } from "three";
import { useAppSelector } from "../../../hooks/state";
import useGenerateTerrainOctree from "../../../hooks/terrain/useGenerateTerrainOctree";

export const FlatTerrain = () => {
  const [min_m] = useState(() => new Vector3(-10, -10, -1));
  const [max_m] = useState(() => new Vector3(10, 10, 1));
  const terrainOctree = useGenerateTerrainOctree(min_m, max_m);
  const generated = useAppSelector((state) => !state.terrain.generating);

  // To add hook which takes the terrain octree and uses some current field of view to raycast (-ve Z direction)
  // and find the solid terrain heights. Pass into marching cubes?

  return (
    <group>
      {generated && terrainOctree.current && (
        <mesh>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color={"grey"} />
        </mesh>
      )}
    </group>
  );
};

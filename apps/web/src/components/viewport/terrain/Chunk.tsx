import { useCallback, useEffect, useRef, useState } from "react";
import { Terrain } from "engine";
import * as THREE from "three";
import { config } from "../../../env/config";

export interface ChunkProps {
  seed: number;
  xMin: number;
  zMin: number;
  xMax: number;
  zMax: number;
}

// TODO - this does not gracefully handle the change of parameters (e.g. re-rendering without unmounting)
export const Chunk = ({ seed, xMin, zMin, xMax, zMax }: ChunkProps) => {
  const verts = useRef<Float32Array>();
  const cells = useRef<Uint32Array>();
  const [chunkReady, setChunkReady] = useState(false);

  const loadChunk = useCallback(() => {
    setChunkReady(false);
    const terrain = new Terrain(seed);
    const chunk = terrain.loadMesh(
      xMin,
      config.minY,
      zMin,
      xMax,
      config.maxY,
      zMax
    );
    verts.current = new Float32Array(chunk.positions.flat());
    cells.current = new Uint32Array(chunk.cells.flat());
    setChunkReady(true);
  }, [seed, xMax, xMin, zMax, zMin]);

  useEffect(() => {
    loadChunk();
  }, [loadChunk]);

  return (
    <>
      {chunkReady && (
        <mesh>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => self.computeVertexNormals()}
          >
            <bufferAttribute
              attach="index"
              array={cells.current}
              count={cells.current.length}
              itemSize={1}
            />
            <bufferAttribute
              attachObject={["attributes", "position"]}
              array={verts.current}
              count={verts.current.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial attach="material" color="green" />
        </mesh>
      )}
    </>
  );
};

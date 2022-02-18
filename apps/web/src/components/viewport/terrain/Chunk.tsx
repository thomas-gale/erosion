import { useCallback, useEffect, useRef, useState } from "react";
import { Terrain } from "engine";

export interface ChunkProps {
  seed: number;
  x: number;
  y: number;
  z: number;
  size: number;
}

export const Chunk = ({ seed, x, y, z, size = 32 }: ChunkProps) => {
  const verts = useRef<Float32Array>();
  const cells = useRef<Uint32Array>();
  const [chunkReady, setChunkReady] = useState(false);

  const loadChunk = useCallback(() => {
    setChunkReady(false);
    const terrain = new Terrain(seed);
    const chunk = terrain.loadChunkMesh(x, y, z, size);
    verts.current = new Float32Array(chunk.positions.flat());
    cells.current = new Uint32Array(chunk.cells.flat());
    setChunkReady(true);
  }, [seed, size, x, y, z]);

  useEffect(() => {
    loadChunk();
  }, [loadChunk]);

  return (
    <>
      {chunkReady && (
        <mesh>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="index"
              array={cells.current}
              count={cells.current.length}
              itemSize={1}
            />
            <bufferAttribute
              attachObject={["attributes", "position"]}
              count={verts.current.length / 3}
              array={verts.current}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial attach="material" color={0x999999} />
        </mesh>
      )}
    </>
  );
};

import { useCallback, useEffect, useRef, useState } from "react";
import { Terrain } from "engine";

export interface ChunkProps {
  x: number;
  y: number;
  z: number;
  size: number;
}

export const Chunk = ({ x, y, z, size = 32 }: ChunkProps) => {
  const verts = useRef<Float32Array>();
  const cells = useRef<Uint32Array>();
  const [chunkReady, setChunkReady] = useState(false);

  const loadChunk = useCallback(() => {
    setChunkReady(false);
    const terrain = new Terrain();
    const chunk = terrain.loadChunk(x, y, z, size);
    verts.current = new Float32Array(chunk.positions.flat());
    cells.current = new Uint32Array(chunk.cells.flat());
    setChunkReady(true);
  }, [size, x, y, z]);

  useEffect(() => {
    loadChunk();
  }, [loadChunk]);

  return (
    <group position={[-16, -16, -16]}>
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
          <meshBasicMaterial attach="material" wireframe color="grey" />
        </mesh>
      )}
    </group>
  );
};

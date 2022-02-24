import { useEffect, useRef, useState } from "react";
import {
  InitResponse,
  LoadMeshResponse,
  TerrainInputData,
  TerrainPostMessageEvent,
} from "../../../engine/terrain.worker";

export interface ChunkProps {
  seed: number;
  xMin: number;
  zMin: number;
  xMax: number;
  zMax: number;
}

// TODO - this does not gracefully handle the change of parameters (e.g. re-rendering without unmounting)
// Probably need to interface with the three mesh directly.
// Each chunk has its own web worker - to make callback worker easier (TODO - check if this is a problem!)
export const Chunk = ({ seed, xMin, zMin, xMax, zMax }: ChunkProps) => {
  const terrainWorker = useRef<Worker>();
  const geomRef = useRef<THREE.BufferGeometry>();
  const [verts, setVerts] = useState<Float32Array>();
  const [cells, setCells] = useState<Uint32Array>();

  // Init the web worker
  useEffect(() => {
    (async () => {
      console.log(
        `Creating and initializing web worker for ${xMin}, ${zMin}...`
      );
      terrainWorker.current = new Worker(
        new URL("../../../engine/terrain.worker", import.meta.url)
      );

      // Configure the callbacks
      terrainWorker.current.onmessage = async (
        evt: TerrainPostMessageEvent
      ) => {
        if (evt.data.type === "init") {
          const resp = evt.data.payload as InitResponse;
          // Now trigger the loadMesh
          if (resp) {
            console.log(`Triggering web worker mesh for ${xMin}, ${zMin}...`);
            await terrainWorker.current.postMessage({
              type: "loadMesh",
              payload: {
                xMin,
                zMin,
                xMax,
                zMax,
              },
            } as TerrainInputData);
            console.log(`Triggered web worker mesh for ${xMin}, ${zMin}!`);
          } else {
            console.warn(`WebWorker init response for ${xMin}, ${zMin}`, resp);
          }
        } else if (evt.data.type === "loadMesh") {
          const resp = evt.data.payload as LoadMeshResponse;
          console.log(`Loading terrain mesh for ${xMin}, ${zMin}...`);
          setVerts(new Float32Array(resp.positions.flat()));
          setCells(new Uint32Array(resp.cells.flat()));
          if (geomRef.current) {
            // geomRef.current.attributes.
            geomRef.current.index.needsUpdate = true;
            geomRef.current.attributes.position.needsUpdate = true;
            geomRef.current.computeVertexNormals();
          }
          console.log(`Loaded terrain mesh for ${xMin}, ${zMin}!`);
        }
      };

      console.log(`Created and initialized web worker for ${xMin}, ${zMin}!`);

      console.log(`Triggering web worker init for ${xMin}, ${zMin} ...`);
      await terrainWorker.current.postMessage({
        type: "init",
        payload: { seed },
      } as TerrainInputData);
      console.log(`Triggered web worker init for ${xMin}, ${zMin}!`);
    })();
    return () => {
      console.log(`Terminating web worker for ${xMin}, ${zMin}...`);
      terrainWorker.current.terminate();
    };
  }, [seed, xMax, xMin, zMax, zMin]);

  return (
    <>
      {verts && cells && (
        <mesh>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => self.computeVertexNormals()}
            ref={geomRef}
          >
            <bufferAttribute
              attach="index"
              array={cells}
              count={cells.length}
              itemSize={1}
            />
            <bufferAttribute
              attachObject={["attributes", "position"]}
              array={verts}
              count={verts.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial attach="material" wireframe color="green" />
        </mesh>
      )}
    </>
  );
};

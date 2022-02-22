import { useCallback, useEffect, useRef, useState } from "react";
import { Terrain } from "engine";
import * as THREE from "three";
import { config } from "../../../env/config";
import {
  InitResponse,
  LoadMeshResponse,
  TerrainInputData,
  TerrainOutputData,
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
  const verts = useRef<Float32Array>();
  const cells = useRef<Uint32Array>();
  const [ready, setReady] = useState(false);

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
          verts.current = new Float32Array(resp.positions.flat());
          cells.current = new Uint32Array(resp.cells.flat());
          setReady(true);
          console.log(`Loaded terrain mesh for ${xMin}, ${zMin}!`);
        }
      };

      console.log(`Created and initialized web worker for ${xMin}, ${zMin}!`);

      console.log(`Triggering web worker init for ${xMin}, ${zMin} ...`);
      await terrainWorker.current.postMessage({
        type: "init",
        payload: { seed: config.testSeed },
      } as TerrainInputData);
      console.log(`Triggered web worker init for ${xMin}, ${zMin}!`);
    })();
    return () => {
      console.log(`Terminating web worker for ${xMin}, ${zMin}...`);
      terrainWorker.current.terminate();
    };
  }, [xMax, xMin, zMax, zMin]);

  return (
    <>
      {ready && (
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

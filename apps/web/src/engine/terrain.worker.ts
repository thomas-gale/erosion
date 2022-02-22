// This is a module worker, so we can use imports (in the browser too!)
import { Terrain, Mesh } from "engine";
import { initScriptLoader } from "next/script";
import { config } from "../env/config";

let terrain: Terrain;

export interface InitPayload {
  seed: number;
}

export type InitResponse = boolean;

export interface LoadMeshPayload {
  xMin: number;
  zMin: number;
  xMax: number;
  zMax: number;
}

export type LoadMeshResponse = Mesh;

export interface TerrainInputData {
  type: "init" | "loadMesh";
  payload: InitPayload | LoadMeshPayload;
}

export type ErrorResponse = string;

export interface TerrainOutputData {
  type: "init" | "loadMesh" | "error";
  payload: InitResponse | LoadMeshResponse | ErrorResponse;
}

export class TerrainPostMessageEvent extends Event {
  data: TerrainOutputData;
}

class TerrainListenerMessageEvent extends Event {
  data: TerrainInputData;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
addEventListener("message", (event: TerrainListenerMessageEvent) => {
  console.log("(web worker) message received", event.data);
  if (event.data.type === "init") {
    const { seed } = event.data.payload as InitPayload;
    terrain = new Terrain(seed);
    postMessage({
      type: "init",
      payload: true,
    } as TerrainOutputData);
  } else if (event.data.type === "loadMesh") {
    const { xMin, zMin, xMax, zMax } = event.data.payload as LoadMeshPayload;
    const chunk = terrain.loadMesh(
      xMin,
      config.minY,
      zMin,
      xMax,
      config.maxY,
      zMax
    );
    postMessage({
      type: "loadMesh",
      payload: chunk,
    } as TerrainOutputData);
    postMessage(chunk);
  } else {
    postMessage({
      type: "error",
      payload: "unknown message type",
    } as TerrainOutputData);
  }
});

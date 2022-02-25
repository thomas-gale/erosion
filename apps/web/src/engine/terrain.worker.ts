// This is a module worker, so we can use imports (in the browser too!)
import { Terrain, Mesh } from "engine";
import { initScriptLoader } from "next/script";
import { config } from "../env/config";

let terrain: Terrain;

export interface InitPayload {
  seed: number;
}

export type InitResponse = boolean;

export interface LoadChunkMeshPayload {
  xMin: number;
  zMin: number;
  xMax: number;
  zMax: number;
}

export type LoadMeshResponse = Mesh;

export interface ErodeMeshPayload {
  chunk: LoadChunkMeshPayload;
  x: number;
  y: number;
  z: number;
}

export type ErodeMeshResponse = Mesh;

export interface DepositMeshPayload {
  chunk: LoadChunkMeshPayload;
  x: number;
  y: number;
  z: number;
}

export type DepositMeshResponse = Mesh;

export interface TerrainInputData {
  type: "init" | "loadMesh" | "erodeMesh" | "depositMesh";
  payload:
    | InitPayload
    | LoadChunkMeshPayload
    | ErodeMeshPayload
    | DepositMeshPayload;
}

export type ErrorResponse = string;

export interface TerrainOutputData {
  type: "init" | "loadMesh" | "erodeMesh" | "depositMesh" | "error";
  args:
    | InitPayload
    | LoadChunkMeshPayload
    | ErodeMeshPayload
    | DepositMeshPayload;
  payload:
    | InitResponse
    | LoadMeshResponse
    | ErodeMeshResponse
    | DepositMeshResponse
    | ErrorResponse;
}

export class TerrainPostMessageEvent extends Event {
  data: TerrainOutputData;
}

class TerrainListenerMessageEvent extends Event {
  data: TerrainInputData;
}

addEventListener("message", (event: TerrainListenerMessageEvent) => {
  console.log("(web worker) message received", event.data);
  if (event.data.type === "init") {
    const { seed } = event.data.payload as InitPayload;
    terrain = new Terrain(seed);
    postMessage({
      type: "init",
      args: event.data.payload as InitPayload,
      payload: true,
    } as TerrainOutputData);
  } else if (event.data.type === "loadMesh") {
    const { xMin, zMin, xMax, zMax } = event.data
      .payload as LoadChunkMeshPayload;
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
      args: event.data.payload as LoadChunkMeshPayload,
      payload: chunk,
    } as TerrainOutputData);
    postMessage(chunk);
  } else if (event.data.type === "erodeMesh") {
    const {
      x,
      y,
      z,
      chunk: { xMin, zMin, xMax, zMax },
    } = event.data.payload as ErodeMeshPayload;
    terrain.erode(x, y, z);
    const chunk = terrain.loadMesh(
      xMin,
      config.minY,
      zMin,
      xMax,
      config.maxY,
      zMax
    );
    postMessage({
      type: "erodeMesh",
      args: event.data.payload as ErodeMeshPayload,
      payload: chunk,
    } as TerrainOutputData);
    postMessage(chunk);
  } else if (event.data.type === "depositMesh") {
    const {
      x,
      y,
      z,
      chunk: { xMin, zMin, xMax, zMax },
    } = event.data.payload as DepositMeshPayload;
    terrain.deposit(x, y, z);
    const chunk = terrain.loadMesh(
      xMin,
      config.minY,
      zMin,
      xMax,
      config.maxY,
      zMax
    );
    postMessage({
      type: "depositMesh",
      args: event.data.payload as DepositMeshPayload,
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

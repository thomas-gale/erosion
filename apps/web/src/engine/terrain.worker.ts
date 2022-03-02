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

export interface MeshResponse {
  verts: Float32Array;
  vertsNum: number;
  vertsMetadata: Float32Array;
  vertsMetadataStride: number;
  vertsMetadataNum: number;
  cells: Uint32Array;
  cellsNum: number;
}

export type LoadMeshResponse = MeshResponse;

export interface ErodeMeshPayload {
  chunk: LoadChunkMeshPayload;
  x: number;
  y: number;
  z: number;
}

export type ErodeMeshResponse = MeshResponse;

export interface DepositMeshPayload {
  chunk: LoadChunkMeshPayload;
  x: number;
  y: number;
  z: number;
}

export type DepositMeshResponse = MeshResponse;

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

const upperPow2 = (x: number): number => {
  return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
};

const convertToMeshResponse = (mesh: Mesh): MeshResponse => {
  const verts = mesh.positions.flat();
  const vertsMetadata = mesh.metadata.flat();
  const cells = mesh.cells.flat();

  const vertsArray = new Float32Array(upperPow2(verts.length));
  vertsArray.set(verts);

  const vertsMetadataArray = new Float32Array(upperPow2(vertsMetadata.length));
  vertsMetadataArray.set(vertsMetadata);

  const cellsArray = new Uint32Array(upperPow2(cells.length));
  cellsArray.set(cells);

  return {
    verts: vertsArray,
    vertsNum: verts.length,
    vertsMetadata: vertsMetadataArray,
    vertsMetadataNum: vertsMetadata.length,
    vertsMetadataStride: mesh.metadataStride,
    cells: cellsArray,
    cellsNum: cells.length,
  };
};

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
      payload: convertToMeshResponse(chunk),
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
      args: { xMin, zMin, xMax, zMax } as LoadChunkMeshPayload,
      payload: convertToMeshResponse(chunk),
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
      args: { xMin, zMin, xMax, zMax } as LoadChunkMeshPayload,
      payload: convertToMeshResponse(chunk),
    } as TerrainOutputData);
    postMessage(chunk);
  } else {
    postMessage({
      type: "error",
      payload: "unknown message type",
    } as TerrainOutputData);
  }
});

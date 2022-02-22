// This is a module worker, so we can use imports (in the browser too!)
import { Terrain } from "engine";
import { config } from "../env/config";

let terrain: Terrain;

export interface InitPayload {
  seed: number;
}

export interface LoadMeshPayload {
  xMin: number;
  zMin: number;
  xMax: number;
  zMax: number;
}

export interface TerrainData {
  type: "init" | "loadMesh";
  payload: InitPayload | LoadMeshPayload;
}

class TerrainMessageEvent extends Event {
  data: TerrainData;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
addEventListener("message", (event: TerrainMessageEvent) => {
  console.log("message received", event.data);
  if (event.data.type === "init") {
    const { seed } = event.data.payload as InitPayload;
    terrain = new Terrain(seed);
    postMessage("ready");
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
    postMessage(chunk);
  } else {
    postMessage("error");
  }
});

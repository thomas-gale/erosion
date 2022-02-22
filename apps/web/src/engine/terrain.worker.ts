// This is a module worker, so we can use imports (in the browser too!)
import { Terrain } from "engine";
import { config } from "../env/config";

let terrain: Terrain;

export interface TerrainMessageData {
  type: "init" | "loadMesh";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
addEventListener("message", (event: any) => {
  console.log("message received", event.data);
  const args = event.data as TerrainMessageData;
  if (args.type === "init") {
    terrain = new Terrain(event.data.seed);
    postMessage("ready");
  } else if (args.type === "loadMesh") {
    const chunk = terrain.loadMesh(
      args.data.xMin,
      config.minY,
      args.data.zMin,
      args.data.xMax,
      config.maxY,
      args.data.zMax
    );
    postMessage(chunk);
  } else {
    postMessage("error");
  }
});

import isosurface from "isosurface";
import SimplexNoise from "simplex-noise";
import * as d3 from "d3-octree";
import { Mesh } from "./mesh";
import { State } from "./state";

export class Terrain {
  // Base noise function for terrain
  private noise: SimplexNoise;

  // Finest detail size (in si units)
  private leafSize: number;

  // State storage for changes made by players away from the base terrain state
  private deltaOctree: any; // TODO
  private deltaMap: Map<string, State>;

  constructor(seed?: number, leafSize = 1) {
    this.noise = new SimplexNoise(seed);
    this.leafSize = leafSize;
    this.deltaOctree = d3.octree();
    this.deltaMap = new Map<string, State>();
  }

  generateSphereMesh(): Mesh {
    return isosurface.surfaceNets(
      [64, 64, 64],
      function (x: number, y: number, z: number) {
        return x * x + y * y + z * z - 100;
      },
      [
        [-11, -11, -11],
        [11, 11, 11],
      ]
    );
  }

  loadMesh(
    xMin: number,
    yMin: number,
    zMin: number,
    xMax: number,
    yMax: number,
    zMax: number
  ): Mesh {
    return isosurface.surfaceNets(
      [xMax - xMin, yMax - yMin, zMax - zMin],
      (x: number, y: number, z: number) => {
        // Read state from the delta map
        const state = this.deltaMap.get(`${x}-${y}-${z}`);
        if (state) {
          return -state.soil; // Isosurface renders positive side of the surface
        }

        // Else use base procedural noise
        // TODO - compose with different frequencies - https://www.redblobgames.com/maps/terrain-from-noise/

        // Base noise
        let elevation =
          1 * this.noise.noise2D(0.01 * x, 0.01 * z) +
          0.5 * this.noise.noise2D(0.02 * x, 0.02 * z) +
          0.25 * this.noise.noise2D(0.04 * x, 0.04 * z) +
          0.125 * this.noise.noise2D(0.08 * x, 0.08 * z) +
          0.0625 * this.noise.noise2D(0.16 * x, 0.16 * z) +
          0.03125 * this.noise.noise2D(0.32 * x, 0.32 * z);

        elevation = elevation / (1 + 0.5 + 0.25 + 0.125 + 0.0625 + 0.03125);

        // Redistribution
        elevation = Math.pow(elevation, 2);

        // Rescale
        elevation = elevation * 16;

        return y - elevation; // Isosurface renders positive side of the surface
      },
      [
        [xMin, yMin, zMin],
        [xMax, yMax, zMax],
      ]
    );
  }

  erode(x: number, y: number, z: number): void {
    // TODO - erode a radius
    this.deltaOctree.add([x, y, z]);
    this.deltaMap.set(`${x}-${y}-${z}`, { soil: -1 });
  }

  deposit(x: number, y: number, z: number): void {
    // TODO - deposit a radius
    this.deltaOctree.add([x, y, z]);
    this.deltaMap.set(`${x}-${y}-${z}`, { soil: 1 });
  }
}

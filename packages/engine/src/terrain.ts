import isosurface from "isosurface";
import SimplexNoise from "simplex-noise";
import * as d3 from "d3-octree";
import { Mesh } from "./mesh";

export class Terrain {
  // Base noise function for terrain
  private noise: SimplexNoise;

  // Finest detail size (in si units)
  private leafSize: number;

  // State storage for changes made by players away from the base terrain state
  private deltaOctree: any;

  constructor(seed?: number, leafSize = 1) {
    this.noise = new SimplexNoise(seed);
    this.leafSize = leafSize;
    this.deltaOctree = d3.octree();
  }

  private sample(x: number, y: number, z: number): number {
    return this.noise.noise3D(x, y, z);
  }

  generateTestSphere(): Mesh {
    // Compute mesh of sphere
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

  loadChunk(x: number, y: number, z: number, size = 32): Mesh {
    return isosurface.surfaceNets(
      [size, size, size],
      (x: number, y: number, z: number) => {
        return this.sample(x, y, z);
      },
      [
        [x, y, z],
        [x + size, y + size, z + size],
      ]
    );
  }
}

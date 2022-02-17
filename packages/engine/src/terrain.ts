import isosurface from "isosurface";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";

export class Terrain {
  private noise: SimplexNoise;

  constructor(seed?: number) {
    this.noise = new SimplexNoise(seed);
  }

  sample(x: number, y: number, z: number): number {
    return this.noise.noise3D(x, y, z);
  }

  generateTestSphere(): {
    positions: number[][];
    cells: any[][];
  } {
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
}

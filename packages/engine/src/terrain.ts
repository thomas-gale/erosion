import isosurface from "isosurface";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";
import { PointOctree } from "sparse-octree";
import { Mesh } from "./mesh";
import { State } from "./state";

export class Terrain {
  // Base noise function for terrain
  private noise: SimplexNoise;

  // Finest detail size (in si units)
  private leafSize: number;

  // State storage for changes made by players away from the base terrain state
  private deltaOctree: PointOctree<State>;

  constructor(seed?: number, leafSize = 1) {
    this.noise = new SimplexNoise(seed);
    this.leafSize = leafSize;

    const min = new THREE.Vector3(-32768, -32768, -32768);
    const max = new THREE.Vector3(32768, 32768, 32768);
    this.deltaOctree = new PointOctree<State>(min, max, 0.0, 8, 16);
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
        // TODO - look up position in deltaOctree (to see if there is a change)

        // Else use base procedural noise
        // TODO - compose with different frequencies - https://www.redblobgames.com/maps/terrain-from-noise/
        return y - this.noise.noise2D(0.1 * x, 0.1 * z) * 2;
      },
      [
        [xMin, yMin, zMin],
        [xMax, yMax, zMax],
      ]
    );
  }

  erode(p: THREE.Vector3): void {
    this.deltaOctree.set(p, { soil: 0 });
  }

  deposit(p: THREE.Vector3): void {
    this.deltaOctree.set(p, { soil: 1 });
  }
}

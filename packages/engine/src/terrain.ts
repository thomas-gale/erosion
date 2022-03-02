import SimplexNoise from "simplex-noise";
import * as d3 from "d3-octree";
import { Mesh } from "./mesh";
import { State } from "./state";
import { IsosurfaceMesher } from "./isosurfacemesher";

export class Terrain {
  // Base noise function for terrain
  // TODO - add other noise for ores etc.
  private noise: SimplexNoise;

  // Finest detail size (in si units)
  private leafSize: number;

  // State storage for changes made by players away from the base terrain state
  private deltaOctree: any; // TODO
  private deltaMap: Map<string, State>;

  // Utility to compute the isosurface mesh from a given potential function and 3D bounds
  private isosurfaceMesher: IsosurfaceMesher;

  constructor(seed?: number, leafSize = 1) {
    this.noise = new SimplexNoise(seed);
    this.leafSize = leafSize;
    this.deltaOctree = d3.octree();
    this.deltaMap = new Map<string, State>();
    this.isosurfaceMesher = new IsosurfaceMesher();
  }

  generateSphereMesh(): Mesh {
    return this.isosurfaceMesher.generate(
      [64, 64, 64],
      3, // [rock, soil, ...]
      function (x: number, y: number, z: number) {
        return [
          1.0, // rock
          0.0, // soil
          0.0, // TODO
        ];
      },
      [
        [-11, -11, -11],
        [11, 11, 11],
      ]
    );
  }

  // Load mesh, current metadata [rock, soil ...] (volume fractions of leafsize * m^3)
  loadMesh(
    xMin: number,
    yMin: number,
    zMin: number,
    xMax: number,
    yMax: number,
    zMax: number
  ): Mesh {
    return this.isosurfaceMesher.generate(
      [
        (xMax - xMin) / this.leafSize,
        (yMax - yMin) / this.leafSize,
        (zMax - zMin) / this.leafSize,
      ],
      3, // [rock, soil ...]
      (x: number, y: number, z: number) => {
        // Read state from the delta map
        const state = this.deltaMap.get(`${x}-${y}-${z}`);
        if (state) {
          return [
            state.rock, // rock
            state.soil, // soil
            state.ironOre, // TODO...!
          ];
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

        if (elevation > 4) {
          return [
            elevation - y, // rock
            0.0, // soil
            0.0, // TODO
          ];
        } else {
          return [
            0.0, // rock
            elevation - y, // soil
            0.0, // TODO
          ];
        }
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
    this.deltaMap.set(`${x}-${y}-${z}`, {
      soil: 0,
      rock: 0,
      ironOre: 0,
      age: 0,
    });
  }

  deposit(x: number, y: number, z: number): void {
    // TODO - deposit a radius
    this.deltaOctree.add([x, y, z]);
    this.deltaMap.set(`${x}-${y}-${z}`, {
      soil: 1,
      rock: 0,
      ironOre: 0,
      age: 0,
    });
  }
}

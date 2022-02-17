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

  generateRedTestSphere(): THREE.Mesh {
    // Compute mesh of sphere
    let mesh = isosurface.surfaceNets(
      [64, 64, 64],
      function (x: number, y: number, z: number) {
        return x * x + y * y + z * z - 100;
      },
      [
        [-11, -11, -11],
        [11, 11, 11],
      ]
    );

    // Convert to three buffer geometry
    const sphereGeometry = new THREE.BufferGeometry();

    const sphereVertices = new Float32Array(mesh.positions.length * 3);
    mesh.positions.forEach(([x, y, z], i) => {
      sphereVertices[i * 3] = x;
      sphereVertices[i * 3 + 1] = y;
      sphereVertices[i * 3 + 2] = z;
    });

    sphereGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(sphereVertices, 3)
    );

    // Create red material and finally mesh
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    return new THREE.Mesh(sphereGeometry, material);
  }
}

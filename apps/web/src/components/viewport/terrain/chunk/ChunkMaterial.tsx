import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

const ChunkMaterial = shaderMaterial(
  { sunPosition: new THREE.Vector3(0, -1, 0) },
  // vertex shader
  glsl`
    out float height;
    flat out vec3 norm;
    void main() {
      norm = normal;
      height = ((position.y + 32.) / 64.);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    uniform vec3 sunPosition;
    flat in vec3 norm;
    in float height;
    void main() {
      float shadow = 1. - (.75 * dot(normalize(norm), normalize(sunPosition)));
      gl_FragColor = vec4(0.5, height, 0.5, 1.0) * shadow;
    }
  `
);

extend({ ChunkMaterial });

type ChunkMaterialImpl = {
  sunPosition: THREE.Vector3;
} & JSX.IntrinsicElements["shaderMaterial"];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      chunkMaterial: ChunkMaterialImpl;
    }
  }
}

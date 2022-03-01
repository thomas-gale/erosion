import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

const ChunkMaterial = shaderMaterial(
  { lightVector: new THREE.Vector3(0, -1, 0) },
  // vertex shader
  glsl`
    out float height;
    out vec3 norm;
    void main() {
      norm = normal;
      height = ((position.y + 32.) / 64.);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    uniform vec3 lightVector;
    in vec3 norm;
    in float height;
    void main() {
      float shine = 1. - (.5 * dot(normalize(norm), normalize(lightVector)));
      gl_FragColor = vec4(0.5, height, 0.5, 1.0) * shine;
    }
  `
);

extend({ ChunkMaterial });

type ChunkMaterialImpl = {
  lightVector: THREE.Vector3;
} & JSX.IntrinsicElements["shaderMaterial"];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      chunkMaterial: ChunkMaterialImpl;
    }
  }
}

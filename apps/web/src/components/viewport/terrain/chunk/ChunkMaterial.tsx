import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

const ChunkMaterial = shaderMaterial(
  { sunPosition: new THREE.Vector3(0, -1, 0) },
  // vertex shader
  glsl`
    out float height;
    out vec3 norm;

    void main() {
      norm = normal;
      height = position.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    #define grass vec3(.2, .7, .1)
    #define dirt vec3(.5, .5, .3)
    #define rock vec3(.3, .3, .3)

    uniform vec3 sunPosition;

    in vec3 norm;
    in float height;

    void main() {
      float shadow = 1. - (.75 * dot(normalize(norm), normalize(sunPosition)));
      if (normalize(norm).y > 0.96) {
        if (height > 4.) {
          gl_FragColor.rgba = vec4(rock, 1.) * shadow;
        } else {
          gl_FragColor.rgba = vec4(grass, 1.) * shadow;
        }
      } else {
        gl_FragColor.rgba = vec4(dirt, 1.) * shadow;
      }
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

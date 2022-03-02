import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

const ChunkMaterial = shaderMaterial(
  { sunPosition: new THREE.Vector3(0, -1, 0) },
  // vertex shader
  glsl`
    attribute vec3 metadata;

    out vec3 norm;
    out float height;
    out vec2 xz;
    out vec3 md;

    void main() {
      norm = normal;
      height = position.y;
      xz = position.xy;
      md = metadata;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    #define grass vec3(.2, .7, .1)
    #define soil vec3(.5, .5, .3)
    #define rock vec3(.3, .3, .3)
    // TODO - pass from uniform
    #define chunkSize 32.

    uniform vec3 sunPosition;

    in vec3 norm;
    in float height;
    in vec2 xz;
    in vec3 md;

    void main() {
      float shadow = 1. - (.75 * dot(normalize(norm), normalize(sunPosition)));

      // TODO - override grassy if the metadata indicates it's a freshly modified region (to just soil)
      float grassy = smoothstep(.9, 1., normalize(norm).y);
      vec3 soilGrass = mix(soil, grass, grassy);
      vec3 color = vec3(md.x * rock + md.y * soilGrass);

      gl_FragColor.rgba = vec4(color, 1.) * shadow;

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

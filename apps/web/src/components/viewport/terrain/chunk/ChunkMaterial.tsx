import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

const ChunkMaterial = shaderMaterial(
  { sunPosition: new THREE.Vector3(0, -1, 0) },
  // vertex shader
  glsl`
    attribute vec2 metadata;

    out vec3 norm;
    out float height;
    out vec2 xz;
    out vec2 md;

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
    #define dirt vec3(.5, .5, .3)
    #define rock vec3(.3, .3, .3)
    // TODO - pass from uniform
    #define chunkSize 32.

    uniform vec3 sunPosition;

    in vec3 norm;
    in float height;
    in vec2 xz;
    in vec2 md;

    void main() {
      float shadow = 1. - (.75 * dot(normalize(norm), normalize(sunPosition)));

      // Replace with mix? if statements are slow
      if (normalize(norm).y > 0.96) {
        if (height > 4.) {
          // TODO - smoothstep(mod(xz, vec2(chunkSize))? etc.
          gl_FragColor.rgba = vec4(rock, 1. ) * shadow;
        } else {
          gl_FragColor.rgba = vec4(grass * ((md.x + 2.)/3.), 1.) * shadow;
        }
      } else {
        gl_FragColor.rgba = vec4(dirt * ((md.y + 2.)/3.), 1.) * shadow;
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

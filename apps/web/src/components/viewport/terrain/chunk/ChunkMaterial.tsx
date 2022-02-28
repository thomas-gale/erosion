import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

const ChunkMaterial = shaderMaterial(
  {},
  // vertex shader
  glsl`
    out float height;
    void main() {
      height = ((position.y + 32.) / 64.);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    in float height;
    void main() {
      gl_FragColor.rgba = vec4(0.5, height, 0.5, 1.0);
    }
  `
);

extend({ ChunkMaterial });

type ChunkMaterialImpl = JSX.IntrinsicElements["shaderMaterial"];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      chunkMaterial: ChunkMaterialImpl;
    }
  }
}

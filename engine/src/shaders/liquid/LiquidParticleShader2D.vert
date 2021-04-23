precision highp float;
precision highp int;
precision highp sampler2D;

uniform highp mat3 viewProjectionMatrix;

layout(location = 0) in highp vec2 backgroundQuad;
out highp vec2 textureCoords;

// all the mpm point rendering is performed in the fragment shader, simply a
// quad is passed through.
void main() {
  gl_Position = mat4(viewProjectionMatrix) * vec4(backgroundQuad, 0, 1.0);
  // Rotate, scale and translate texture coords from taichi.
  textureCoords = mat2(0., -.5, .5, 0.) * gl_Position.xy + vec2(.5, .5);
}

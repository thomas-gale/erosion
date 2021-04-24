precision highp float;
precision highp int;
precision highp sampler2D;

// fixed settings for liquid shader
#define massScalingFactor 3000.
#define gridSize 32.
#define threshold .5
#define backCol vec3(1., 1., 1.)
#define liqCol vec3(.2, .5, 1.)

uniform highp sampler2D massGridTexture; // Bound to texture unit 0

in highp vec2 textureCoords;
out highp vec4 fragmentColor;

void main() {
  // Compute mask based on linear interpolation of corner values
  vec2 neighbour = vec2(1. / gridSize);

  // sample 4 values about current texture coords (mass grid data stored in red
  // channel)
  mat2 c = mat2(
      texture(massGridTexture, textureCoords).r, // Col 0, Row 0
      texture(massGridTexture, textureCoords + vec2(neighbour.x, 0.))
          .r, // Col 0, Row 1
      texture(massGridTexture, textureCoords + vec2(0., neighbour.y))
          .r, // Col 1, Row 0
      texture(massGridTexture,
              textureCoords + vec2(neighbour.x, neighbour.y)) // Col 1, Row 1
          .r);

  // scale up intensity
  c *= massScalingFactor;

  // bilinear interpolation
  vec2 interp =
      fract(vec2(textureCoords.x / neighbour.x, textureCoords.y / neighbour.y));
  vec2 biX = mix(vec2(c[0][0], c[1][0]), vec2(c[0][1], c[1][1]), interp.x);
  float biRes = mix(biX[0], biX[1], interp.y);

  // threshold if fluid visible
  if (biRes > threshold) {
    fragmentColor = vec4(liqCol, 1.);
  } else {
    fragmentColor = vec4(backCol, 1.);
  }
}

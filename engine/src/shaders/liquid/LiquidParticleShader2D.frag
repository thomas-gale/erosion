precision highp float;
precision highp int;
precision highp sampler2D;

// fixed settings for liquid shader
#define massScalingFactor 4000.
#define theshold .5
#define backCol vec3(1., 1., 1.)
#define liqInvCol vec3(.8, .5, 0.)

uniform highp sampler2D massGridTexture; // Bound to texture unit 0

in highp vec2 textureCoords;
out highp vec4 fragmentColor;

void main() {
  // marching squares hacking!

  // Get size and step values
  ivec2 size = textureSize(massGridTexture, 1);
  vec2 neighbour = vec2(1.) / float(size);

  // Sample 4 values about current texture coords (mass grid data stored in red
  // channel)
  mat2 curr = mat2(
      texture(massGridTexture, textureCoords).r,
      texture(massGridTexture, textureCoords + vec2(0., neighbour.y)).r,
      texture(massGridTexture, textureCoords + vec2(neighbour.x, 0.)).r,
      texture(massGridTexture, textureCoords + vec2(neighbour.x, neighbour.y))
          .r);

  // compute the liquid colour based on mass of liquid in texture cell
  fragmentColor = vec4(backCol - texture(massGridTexture, textureCoords).rrr *
                                     massScalingFactor * liqInvCol,
                       1.);
}

precision highp float;
precision highp int;
precision highp sampler2D;

// fixed settings for liquid shader
#define massScalingFactor 4000.
#define backCol vec3(1., 1., 1.)
#define liqInvCol vec3(.8, .5, 0.)

uniform highp sampler2D massGridTexture; // Bound to texture unit 0

in highp vec2 textureCoords;
out highp vec4 fragmentColor;

void main() {
  // compute the liquid colour based on mass of liquid in texture cell
  fragmentColor = vec4(backCol - texture(massGridTexture, textureCoords).rrr *
                                     massScalingFactor * liqInvCol,
                       1.);
}

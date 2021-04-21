// fixed settings for shader
// #define gridSize 64
#define massScalingFactor 4000.
// #define numberPoints 2048
#define backCol vec3(.4, .4, .4)
#define liqCol vec3(.2, .5, 1.)
// #define blobSize .01
// #define blobThres 1.

// uniform highp int screenHeight;
// uniform highp int screenWidth;
uniform sampler2D massGridTexture; // Bound to texture unit 0
// uniform sampler2D mpmPointsTexture; // Bound to texture unit 1

in highp vec2 textureCoords;
out highp vec4 fragmentColor;

void main() {
  fragmentColor = vec4(backCol + texture(massGridTexture, textureCoords).rrr * massScalingFactor * liqCol, 1.);
}

// MetaBall Impl

// https://en.wikipedia.org/wiki/Metaballs
// highp float metaball(highp float r, highp vec2 uv, highp vec2 pos) {
//   return pow(r, 2.) / (pow(uv.x - pos.x, 2.) + pow(uv.y - pos.y, 2.));
// }

// void main() {
//   highp vec2 uv = gl_FragCoord.xy / vec2(screenWidth, screenHeight);
//   // metaball sum
//   highp float f = 0.;
//   for (int i = 0; i < numberPoints/2; ++i) {
//     // todo: test sample range - I belive that the second half of texture is garbage
//     // read mpm point coords from rg channel of data texture (2D of dimension
//     // [pointNumber,1])
//     highp vec2 point =
//         texture(mpmPointsTexture, vec2(float(i) / (2. * float(numberPoints)), .5)).rg +
//         vec2(.5, .5);

//     // sum up metaball contribution to this fragment from each point.
//     f = f + metaball(blobSize, uv, point);
//   }
//   // pick fragment state (water/void)
//   highp vec3 col = (f > blobThres) ? liqCol : backCol;

//   // finally assign output fragment colour
//   fragmentColor = vec4(col, 1.);
// }

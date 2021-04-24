precision highp float;
precision highp int;
precision highp sampler2D;

// fixed settings for liquid shader
#define massScalingFactor 5000.
#define gridSize 32.
#define threshold .5
#define backCol vec3(1., 1., 1.)
#define liqCol vec3(.2, .5, 1.)

uniform highp sampler2D massGridTexture; // Bound to texture unit 0

in highp vec2 textureCoords;
out highp vec4 fragmentColor;

// attribution: https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
float triangular(float f) {
  f = f / 2.0;
  if (f < 0.0) {
    return (f + 1.0);
  } else {
    return (1.0 - f);
  }
  return 0.0;
}

// attribution: https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL
vec4 biCubic(sampler2D textureSampler, vec2 texCoord) {
  float texelSizeX = 1.0 / gridSize; // size of one texel
  float texelSizeY = 1.0 / gridSize; // size of one texel
  vec4 nSum = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 nDenom = vec4(0.0, 0.0, 0.0, 0.0);
  float a = fract(texCoord.x * gridSize);  // get the decimal part
  float b = fract(texCoord.y * gridSize); // get the decimal part
  for (int m = -1; m <= 2; m++) {
    for (int n = -1; n <= 2; n++) {
      vec4 vecData =
          texture(textureSampler, texCoord + vec2(texelSizeX * float(m),
                                                  texelSizeY *float(n))) *
          massScalingFactor;
      float f = triangular(float(m) - a);
      vec4 vecCooef1 = vec4(f, f, f, f);
      float f1 = triangular(-(float(n) - b));
      vec4 vecCoeef2 = vec4(f1, f1, f1, f1);
      nSum = nSum + (vecData * vecCoeef2 * vecCooef1);
      nDenom = nDenom + ((vecCoeef2 * vecCooef1));
    }
  }
  return nSum / nDenom;
}

void main() {
  // bicubic interpolation
  vec4 val = biCubic(massGridTexture, textureCoords);

  // threshold if fluid visible
  if (val.r > threshold) {
    fragmentColor = vec4(liqCol, 1.);
  } else {
    fragmentColor = vec4(backCol, 1.);
  }
}

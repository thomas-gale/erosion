/*
    This file is part of Magnum.

    Original authors — credit is appreciated but not required:

        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020 —
            Vladimír Vondruš <mosra@centrum.cz>
        2019 — Nghia Truong <nghiatruong.vn@gmail.com>

    This is free and unencumbered software released into the public domain.

    Anyone is free to copy, modify, publish, use, compile, sell, or distribute
    this software, either in source code form or as a compiled binary, for any
    purpose, commercial or non-commercial, and by any means.

    In jurisdictions that recognize copyright laws, the author or authors of
    this software dedicate any and all copyright interest in the software to
    the public domain. We make this dedication for the benefit of the public
    at large and to the detriment of our heirs and successors. We intend this
    dedication to be an overt act of relinquishment in perpetuity of all
    present and future rights to this software under copyright law.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// uniform highp int numberPoints;// layout(std140) uniform Mpm { highp vec2
// mpmPos[1024]; }; layout(std140) uniform Mpm2 { highp vec2 mpmPos2[32]; };

#define numberPoints 256
#define backCol vec3(.4, .4, .4)
#define liqCol vec3(.2, .5, 1.)
#define blobSize .01

uniform highp int screenHeight;
uniform highp int screenWidth;
// uniform highp int numberPoints;
uniform sampler2D mpmPointsTexture; // Bound to texture unit 0
// uniform sampler2D voronoiseTexture; // Bound to texture unit 1

in highp vec2 interpolatedTextureCoordinates;
out highp vec4 fragmentColor;

// https://en.wikipedia.org/wiki/Metaballs
highp float metaball(highp float r, highp vec2 uv, highp vec2 pos) {
  return pow(r, 2.) / (pow(uv.x - pos.x, 2.) + pow(uv.y - pos.y, 2.));
}

highp float circle(highp vec2 uv, highp vec2 pos, highp float r) {
  return r / distance(uv, pos);
}

void main() {
  // highp vec2 point = gl_PointCoord.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0);

  // highp float ball = metaball(point, 1.0f);
  // highp float c = clamp(ball+0.5f, 0.5f, 1.0f);

  // highp float mag = clamp(dot(point, point), 0.0, 1.0);

  // if (mag > 0.9)
  // discard; /* outside the circle */

  highp vec2 uv = gl_FragCoord.xy / vec2(screenWidth, screenHeight);

  // Total falloff for frag over all mpm points
  highp float f = 0.;
  // highp float distSquaredSum = 1.;

  for (int i = 0; i < numberPoints/2; ++i) {
    // read mpm point coords from rg channel of data texture (2D of dimension
    // [pointNumber,1])
    highp vec2 point =
        texture(mpmPointsTexture, vec2(float(i) / (2. * float(numberPoints)), .5)).rg +
        vec2(.5, .5);

    // highp float dist = distance(uv, point);

    // if (dist > .1) {
    //   continue;
    // }

    // if (dist < 0.02) {
    //   fragmentColor = vec4(liqCol, 1.);
    //   break;
    // }

    // distSquaredSum = distSquaredSum * clamp(dist, .1, 1.);

    // distSquaredSum = distSquaredSum * clamp((1. / pow(distance(uv,
    // point), 2.)), 0.5, 1.);

    // if (dist < .1) {

    f = f + metaball(blobSize, uv, point);
    // }

    // compute fall off for each point and accumulate product
    // f = f * clamp(metaballFallOff(distance(uv, point)), .1, 1.);
    // f = f * clamp(circle(uv, point, blobSize), .1, 1.);
    // f = f * circle(uv, point, blobSize);
  }

  // Normalise
  // highp float f = 1. - distSquaredSum;

  // clamp colour
  highp vec3 col = (f > 1.) ? liqCol : backCol;
  // highp vec3 col = (f > .999999) ? liqCol : backCol;
  fragmentColor = vec4(col, 1.);
  // fragmentColor = vec4(vec3(f), 1.);

  // uv -= 0.5;

  // highp float c = circle(uv, point, 1.0);
  // highp float mag = dot(point, point);

  // highp vec2 correctedTexCoords = interpolatedTextureCoordinates *
  // vec2(0.5, 0.5) + vec2(0.5, 0.5); highp vec2 correctedTexCoords =
  // interpolatedTextureCoordinates * vec2(0.5, 0.5) + vec2(0.5, 0.5);

  // highp vec2 correctedTexCoords =
  //     interpolatedTextureCoordinates * vec2(1.0, -1.0) + vec2(0.5, 0.5);

  // fragmentColor = vec4(1.0, 1.0, 1.0, 1.0);
  // fragmentColor.rgb = texture(voronoiseTexture, correctedTexCoords).rrr;
  // fragmentColor.rg = fragmentColor.rg * texture(mpmPointsTexture,
  // interpolatedTextureCoordinates).rg;
}
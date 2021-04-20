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

// fixed settings for shader
#define numberPoints 2048
#define backCol vec3(.4, .4, .4)
#define liqCol vec3(.2, .5, 1.)
#define blobSize .01
#define blobThres 1.

uniform highp int screenHeight;
uniform highp int screenWidth;
uniform sampler2D mpmPointsTexture; // Bound to texture unit 0

out highp vec4 fragmentColor;

// https://en.wikipedia.org/wiki/Metaballs
highp float metaball(highp float r, highp vec2 uv, highp vec2 pos) {
  return pow(r, 2.) / (pow(uv.x - pos.x, 2.) + pow(uv.y - pos.y, 2.));
}

void main() {
  highp vec2 uv = gl_FragCoord.xy / vec2(screenWidth, screenHeight);
  // metaball sum
  highp float f = 0.;
  for (int i = 0; i < numberPoints/2; ++i) {
    // todo: test sample range - I belive that the second half of texture is garbage
    // read mpm point coords from rg channel of data texture (2D of dimension
    // [pointNumber,1])
    highp vec2 point =
        texture(mpmPointsTexture, vec2(float(i) / (2. * float(numberPoints)), .5)).rg +
        vec2(.5, .5);

    // sum up metaball contribution to this fragment from each point.
    f = f + metaball(blobSize, uv, point);
  }
  // pick fragment state (water/void)
  highp vec3 col = (f > blobThres) ? liqCol : backCol;

  // finally assign output fragment colour
  fragmentColor = vec4(col, 1.);
}

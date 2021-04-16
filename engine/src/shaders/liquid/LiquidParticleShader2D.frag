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

// uniform highp int numberPoints;
layout(std140) uniform Mpm { mediump vec2 mpmPos[2048]; };

uniform highp int screenHeight;
uniform highp int screenWidth;

flat in lowp vec3 color;
out mediump vec4 fragmentColor;

mediump float circle(mediump vec2 uv, mediump vec2 pos, mediump float r) {
  return r / distance(uv, pos);
}

void main() {
  // mediump vec2 point = gl_PointCoord.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0);

  // mediump float ball = metaball(point, 1.0f);
  // mediump float c = clamp(ball+0.5f, 0.5f, 1.0f);

  // mediump float mag = clamp(dot(point, point), 0.0, 1.0);

  // if (mag > 0.9)
  // discard; /* outside the circle */

  mediump vec2 uv = gl_FragCoord.xy / vec2(screenWidth, screenHeight);
  uv -= 0.5;

  // mediump float c = circle(uv, point, 1.0);
  // mediump float mag = dot(point, point);

  fragmentColor = vec4(uv, 0.0f, 1.0f);

  // fragmentColor = vec4(color, 0.5f - mag);
  // fragmentColor = vec4(vec3(0.0), 0.0) + vec4(0.0, 1.0 * c / 3.0, 1.0, c) *
  // c;
}
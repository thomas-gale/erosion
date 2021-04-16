#ifndef Magnum_Examples_FluidSimulation2D_ParticleSphereFlatShader_h
#define Magnum_Examples_FluidSimulation2D_ParticleSphereFlatShader_h
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

#include <Magnum/GL/AbstractShaderProgram.h>
#include <Magnum/GL/Buffer.h>
#include <Magnum/Types.h>
#include <Magnum/GL/GL.h>

namespace erosion {

using namespace Magnum;

class LiquidParticleShader2D : public GL::AbstractShaderProgram {
public:
  explicit LiquidParticleShader2D();

  // LiquidParticleShader2D &setNumberMPMPoints(Int number);
  // LiquidParticleShader2D &setMPMPoints(Containers::ArrayView<const
  // Math::Vector<2, Float>> points);

  LiquidParticleShader2D &setMPMPoints(const std::vector<Vector2> &points);
  LiquidParticleShader2D &setParticleRadius(Float radius);
  LiquidParticleShader2D &setColor(const Color3 &color);
  LiquidParticleShader2D &setViewport(const Vector2i &viewport);
  LiquidParticleShader2D &setViewProjectionMatrix(const Matrix3 &matrix);
  LiquidParticleShader2D &setScreenHeight(Int height);
  LiquidParticleShader2D &setScreenWidth(Int width);
  LiquidParticleShader2D &setDomainHeight(Int height);

private:
  GL::Buffer _bufferParticles;

  UnsignedInt _uMpmPoints;

  Int _uParticleRadius, _uColor, _uViewProjectionMatrix, _uScreenHeight,
      _uScreenWidth, _uDomainHeight;
};

} // namespace erosion

#endif
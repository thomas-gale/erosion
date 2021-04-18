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

#include <iostream>

#include "shaders/liquid/LiquidParticleShader2D.h"

#include <Corrade/Containers/Reference.h>
#include <Corrade/Utility/Resource.h>
#include <Magnum/GL/AbstractShaderProgram.h>
#include <Magnum/GL/Buffer.h>
#include <Magnum/GL/Renderer.h>
#include <Magnum/GL/Shader.h>
#include <Magnum/GL/Texture.h>
#include <Magnum/GL/Version.h>
#include <Magnum/Math/Color.h>
#include <Magnum/Math/Matrix3.h>

namespace erosion {

LiquidParticleShader2D::LiquidParticleShader2D() {
  Utility::Resource rs("data");

  GL::Shader vertShader{GL::Version::GLES300, GL::Shader::Type::Vertex};
  GL::Shader fragShader{GL::Version::GLES300, GL::Shader::Type::Fragment};
  vertShader.addSource(rs.get("LiquidParticleShader2D.vert"));
  fragShader.addSource(rs.get("LiquidParticleShader2D.frag"));

  CORRADE_INTERNAL_ASSERT(GL::Shader::compile({vertShader, fragShader}));
  attachShaders({vertShader, fragShader});
  CORRADE_INTERNAL_ASSERT(link());

  // _uNumberMPMPoints = uniformLocation("numberPoints");
  // _uMpmPoints = uniformLocation("mpmPos");
  // _uMpm = uniformBlockIndex("Mpm");
  // std::cout << "Mpm blockIndex: " << _uMpm << std::endl;

  // _uParticleRadius = uniformLocation("particleRadius");
  // _uColor = uniformLocation("uniformColor");

  _uViewProjectionMatrix = uniformLocation("viewProjectionMatrix");
  std::cout << "_uViewProjectionMatrix: " << _uViewProjectionMatrix
            << std::endl;
  _uScreenHeight = uniformLocation("screenHeight");
  _uScreenWidth = uniformLocation("screenWidth");
  // _uDomainHeight = uniformLocation("domainHeight");
}

// LiquidParticleShader2D &LiquidParticleShader2D::setNumberMPMPoints(Int
// number) {
//   setUniform(_uNumberMPMPoints, number);
//   return *this;
// }

// LiquidParticleShader2D &
// LiquidParticleShader2D::setMPMPoints(const Math::Vector<2, Float>> points) {
//   setUniform(_uMpmPoints, points);
//   return *this;
// }

LiquidParticleShader2D &
LiquidParticleShader2D::bindVoronoiseTexture(GL::Texture2D& texture) {
  texture.bind(VoronoiseTextureUnit);
  return *this;
}

LiquidParticleShader2D &
LiquidParticleShader2D::bindMPMPointsTexture(GL::Texture2D& texture) {
  texture.bind(ParticlesTextureUnit);
  return *this;
}

// LiquidParticleShader2D &
// LiquidParticleShader2D::setMPMPoints(const std::vector<Vector2> &points) {

//   Containers::ArrayView<const float> data(
//       reinterpret_cast<const float *>(&points[0]), points.size() * 2);

//   // _bufferParticles = GL::Buffer{GL::Buffer::TargetHint::Uniform};
//   // _bufferParticles.setData(data);
//   // _bufferParticles.bind(GL::Buffer::Target::Uniform, _uMpm);

//   // std::cout << "mpmPos blockIndex: " << uniformBlockIndex("mpmPos") <<
//   // std::endl; std::cout << "_MpmPoints: " << _uMpmPoints << std::endl;

//   // std::cout << "Mpm2 blockIndex: " << uniformBlockIndex("Mpm2") << std::endl;
//   // std::cout << "mpmPos2 blockIndex: " << uniformBlockIndex("mpmPos2") <<
//   // std::endl;

//   // setUniformBlockBinding(uniformBlockIndex("Mpm"), _uMpmPoints);
//   // setUniform(_uMpmPoints, data);
//   // setUniform(uniformBlockIndex("Mpm"), data);

//   return *this;
// }

// LiquidParticleShader2D &
// LiquidParticleShader2D::setParticleRadius(Float radius) {
//   setUniform(_uParticleRadius, radius);
//   return *this;
// }

// LiquidParticleShader2D &LiquidParticleShader2D::setColor(const Color3 &color) {
//   setUniform(_uColor, color);
//   return *this;
// }

LiquidParticleShader2D &
LiquidParticleShader2D::setViewProjectionMatrix(const Matrix3 &matrix) {
  setUniform(_uViewProjectionMatrix, matrix);
  return *this;
}

LiquidParticleShader2D &LiquidParticleShader2D::setScreenHeight(Int height) {
  setUniform(_uScreenHeight, height);
  return *this;
}

LiquidParticleShader2D &LiquidParticleShader2D::setScreenWidth(Int width) {
  setUniform(_uScreenWidth, width);
  return *this;
}

// LiquidParticleShader2D &LiquidParticleShader2D::setDomainHeight(Int height) {
//   setUniform(_uDomainHeight, height);
//   return *this;
// }
} // namespace erosion
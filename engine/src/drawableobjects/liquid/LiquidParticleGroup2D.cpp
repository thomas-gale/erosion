/*
    This file is part of Magnum.

    Original authors — credit is appreciated but not required:

        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021
             — Vladimír Vondruš <mosra@centrum.cz>
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

#include "drawableobjects/liquid/LiquidParticleGroup2D.h"

#include <Corrade/Containers/ArrayView.h>
#include <Corrade/Containers/Optional.h>
#include <Corrade/PluginManager/Manager.h>
#include <Corrade/Utility/Assert.h>
#include <Corrade/Utility/Resource.h>
#include <Magnum/GL/AbstractShaderProgram.h>
#include <Magnum/GL/Renderer.h>
#include <Magnum/GL/TextureFormat.h>
#include <Magnum/Math/Functions.h>
#include <Magnum/MeshTools/CompressIndices.h>
#include <Magnum/MeshTools/Interleave.h>
#include <Magnum/PixelFormat.h>
#include <Magnum/Primitives/Square.h>
#include <Magnum/SceneGraph/Drawable.h>
#include <Magnum/Shaders/Generic.h>
#include <Magnum/Trade/AbstractImporter.h>
#include <Magnum/Trade/ImageData.h>
#include <Magnum/Trade/MeshData.h>
#include <Magnum/Trade/Trade.h>

namespace erosion {

using namespace Math::Literals;

LiquidParticleGroup2D::LiquidParticleGroup2D(ImageView2D massGrid,
                                             ImageView2D velGrid)
    : _massGrid(massGrid), _velGrid(velGrid) {

  _particleShader.reset(new LiquidParticleShader2D);

  // background quad
  Trade::MeshData quad = Primitives::squareSolid();
  GL::Buffer quadVerts;
  quadVerts.setData(quad.positions2DAsArray());

  _meshBackgroudQuad.setPrimitive(quad.primitive())
      .setCount(quad.positions2DAsArray().size())
      .addVertexBuffer(std::move(quadVerts), 0, Shaders::Generic2D::Position{});
}

LiquidParticleGroup2D &
LiquidParticleGroup2D::draw(Containers::Pointer<SceneGraph::Camera2D> &camera,
                            Int screenHeight, Int screenWidth,
                            Int projectionHeight) {

  // set R32F texture from mass grid data
  GL::Texture2D massGridTexture;
  massGridTexture.setMinificationFilter(GL::SamplerFilter::Nearest)
      .setMagnificationFilter(GL::SamplerFilter::Nearest)
      .setWrapping(GL::SamplerWrapping::ClampToEdge)
      .setStorage(1, GL::textureFormat(PixelFormat::R32F), _massGrid.size())
      .setSubImage(0, {}, _massGrid);

  // set RG32F texture from vel grid data
  GL::Texture2D velGridTexture;
  velGridTexture.setMinificationFilter(GL::SamplerFilter::Nearest)
      .setMagnificationFilter(GL::SamplerFilter::Nearest)
      .setWrapping(GL::SamplerWrapping::ClampToEdge)
      .setStorage(1, GL::textureFormat(PixelFormat::RG32F), _velGrid.size())
      .setSubImage(0, {}, _velGrid);

  // configuring the shader and draw.
  (*_particleShader)
      .setViewProjectionMatrix(camera->projectionMatrix() *
                               camera->cameraMatrix())
      .setGridSize(_velGrid.size())
      .bindMassGridTexture(massGridTexture)
      .bindVelGridTexture(velGridTexture)
      .draw(_meshBackgroudQuad);

  return *this;
}
} // namespace erosion
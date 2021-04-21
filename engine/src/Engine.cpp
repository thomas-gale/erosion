#include <cmath>
#include <iostream>
#include <memory>

#include <Corrade/Containers/ArrayView.h>
#include <Corrade/Containers/Pointer.h>
#include <Corrade/Utility/StlMath.h>
#include <Magnum/GL/Context.h>
#include <Magnum/GL/DefaultFramebuffer.h>
#include <Magnum/GL/PixelFormat.h>
#include <Magnum/GL/Renderer.h>
#include <Magnum/GL/Version.h>
#include <Magnum/ImageView.h>
#include <Magnum/Math/Color.h>
#include <Magnum/Math/FunctionsBatch.h>
#include <Magnum/MeshTools/Compile.h>
#ifdef CORRADE_TARGET_EMSCRIPTEN
#include <Magnum/Platform/EmscriptenApplication.h>
#else
#include <Magnum/Platform/Sdl2Application.h>
#endif
#include <Magnum/Magnum.h>
#include <Magnum/PixelFormat.h>
#include <Magnum/Primitives/Circle.h>
#include <Magnum/SceneGraph/Camera.h>
#include <Magnum/SceneGraph/Drawable.h>
#include <Magnum/SceneGraph/MatrixTransformation2D.h>
#include <Magnum/SceneGraph/Scene.h>
#include <Magnum/Timeline.h>
#include <Magnum/Trade/MeshData.h>

#include "drawableobjects/liquid/LiquidParticleGroup2D.h"

extern "C" {
#include "taichi/mpm88.py.h"
}

namespace erosion {

using namespace Magnum;
using namespace Math::Literals;

using Scene2D = SceneGraph::Scene<SceneGraph::MatrixTransformation2D>;
using Object2D = SceneGraph::Object<SceneGraph::MatrixTransformation2D>;

class Engine : public Platform::Application {
public:
  explicit Engine(const Arguments &arguments);

private:
  static int constexpr SIMULATION_SUBSTEP = 10;

  void drawEvent() override;
  void updateParticles();

  // scene and drawable group must be constructed before camera and other
  // drawable objects
  Containers::Pointer<Scene2D> _scene;
  Containers::Pointer<SceneGraph::DrawableGroup2D> _drawableGroup;

  // camera helpers
  Containers::Pointer<Object2D> _objCamera;
  Containers::Pointer<SceneGraph::Camera2D> _camera;

  // engine entities
  int _gridSize;
  Containers::ArrayView<const float> _massGridView;
  Containers::Pointer<ImageView2D> _massGridImageView;

  int _numParticles;
  std::vector<Vector2> _pointPositions;
  Containers::Pointer<LiquidParticleGroup2D> _drawableParticles;
  Timeline timeline_;
};

Engine::Engine(const Arguments &arguments)
    : Platform::Application{arguments, NoCreate} {

  // setup taichi
  std::cout << "Initialising taichi..." << std::endl;
  Tk_reset_c6_0(&Ti_ctx);
  std::cout << "Initialised taichi!" << std::endl;

  Tk_get_num_particles_c10_0(&Ti_ctx);
  _numParticles = Ti_ctx.args[0].val_i32;
  std::cout << "Number of particles: " << _numParticles << std::endl;

  Tk_get_grid_size_c8_0(&Ti_ctx);
  _gridSize = Ti_ctx.args[0].val_i32;
  std::cout << "Grid Size: " << _gridSize << " x " << _gridSize << std::endl;

  // bind view to grid data
  _massGridView = Containers::ArrayView<const float>(
      reinterpret_cast<const float *>(Ti_ctx.root->S17), _gridSize * _gridSize);
  _massGridImageView.emplace(PixelFormat::R32F, Vector2i{_gridSize * _gridSize, 1}, _massGridView);

  // GL::Texture2D particlesTexture;
  // particlesTexture.setWrapping(GL::SamplerWrapping::ClampToEdge)
  //     .setStorage(1, GL::textureFormat(PixelFormat::RG32F),
  //                 Vector2i{int(_points.size() * 2), 1})
  //     .setSubImage(0, {}, pointsData);

  // setup window
  std::cout << "Setting up window..." << std::endl;
  {
    const Vector2 dpiScaling = this->dpiScaling({});
    Configuration conf;
    conf.setTitle("Magnum 2D Fluid Simulation Example")
        .setSize(conf.size(), dpiScaling)
        .setWindowFlags(Configuration::WindowFlag::Resizable);
    GLConfiguration glConf;
    glConf.setSampleCount(dpiScaling.max() < 2.0f ? 8 : 2);
    if (!tryCreate(conf, glConf)) {
      create(conf, glConf.setSampleCount(0));
    }
  }
  std::cout << "Window scaling and GL context done..." << std::endl;

  // setup scene objects and camera
  _scene.emplace();
  _drawableGroup.emplace();

  // configure camera
  auto size = GL::defaultFramebuffer.viewport().size();
  std::cout << "Viewport size: " << size.x() << " x " << size.y() << std::endl;
  _objCamera.emplace(_scene.get());
  _camera.emplace(*_objCamera);
  _camera->setAspectRatioPolicy(SceneGraph::AspectRatioPolicy::Extend)
      .setProjectionMatrix(Matrix3::projection(Vector2(1.0f, 1.0f)))
      .setViewport(GL::defaultFramebuffer.viewport().size());

  // setup mpm sim data
  _pointPositions = std::vector<Vector2>(_numParticles);
  updateParticles();
  _drawableParticles.emplace(_pointPositions);

  GL::Renderer::enable(GL::Renderer::Feature::DepthTest);
}

void Engine::drawEvent() {

  // update mpm simulation
  for (int i = 0; i < SIMULATION_SUBSTEP; ++i) {
    Tk_substep_c4_0(&Ti_ctx);
  }
  updateParticles();

  // drawing code
  GL::defaultFramebuffer.clear(GL::FramebufferClear::Color |
                               GL::FramebufferClear::Depth);

  // trigger drawable object to update the particles to the GPU
  _drawableParticles->draw(_camera,
                           GL::defaultFramebuffer.viewport().size().y(),
                           GL::defaultFramebuffer.viewport().size().x(), 1.0);

  // draw
  swapBuffers();

  // run next frame immediately (emscripten pauses otherwise)
  redraw();
}

void Engine::updateParticles() {
  // Tk_hub_get_particles_c14_0(&Ti_ctx);
  for (auto i = 0; i < _numParticles; ++i) {
    _pointPositions[i] =
        Vector2(Ti_ctx.root->S1[i].S2 - 0.5, Ti_ctx.root->S1[i].S3 - 0.5);
  }
}

} // namespace erosion

MAGNUM_EMSCRIPTENAPPLICATION_MAIN(erosion::Engine)

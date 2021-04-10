#include <iostream>
#include <memory>

#include <Corrade/Containers/Pointer.h>
#include <Corrade/Utility/StlMath.h>
#include <Magnum/GL/Context.h>
#include <Magnum/GL/DefaultFramebuffer.h>
#include <Magnum/GL/PixelFormat.h>
#include <Magnum/GL/Renderer.h>
#include <Magnum/GL/Version.h>
#include <Magnum/Primitives/Circle.h>
#include <Magnum/SceneGraph/Camera.h>
#include <Magnum/SceneGraph/Drawable.h>
#include <Magnum/SceneGraph/FeatureGroup.h>
#include <Magnum/SceneGraph/MatrixTransformation2D.h>
#include <Magnum/SceneGraph/Scene.h>
#include <Magnum/SceneGraph/SceneGraph.h>
#include <Magnum/Timeline.h>
#ifndef CORRADE_TARGET_EMSCRIPTEN
#include <Magnum/Platform/Sdl2Application.h>
#else
#include <Magnum/Platform/EmscriptenApplication.h>
#endif

#include "drawableobjects/ParticleGroup2D.h"

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
  void drawEvent() override;

  // GL context
  // std::unique_ptr<Platform::GLContext> context_;

  // Scene and drawable group must be constructed before camera and other
  // drawable objects
  Containers::Pointer<Scene2D> _scene;
  Containers::Pointer<SceneGraph::DrawableGroup2D> _drawableGroup;

  // Camera helpers
  Containers::Pointer<Object2D> _objCamera;
  Containers::Pointer<SceneGraph::Camera2D> _camera;

  // Engine entities
  Containers::Pointer<ParticleGroup2D> _drawableParticles;
  Timeline timeline_;
};

namespace {

constexpr Float GridCellLength = 1.0f;       /* length of 1 grid cell */
constexpr Vector2i NumGridCells{100, 100};   /* number of cells */
constexpr Vector2 GridStart{-50.0f, -50.0f}; /* lower corner of the grid */
constexpr Int RadiusCircleBoundary = 45;     /* radius of the boundary circle */

/* Viewport will display this window */
constexpr Float ProjectionScale = 1.05f;
const Vector2i DomainDisplaySize =
    NumGridCells * GridCellLength * ProjectionScale;

Vector2 gridCenter() {
  return Vector2{NumGridCells} * GridCellLength * 0.5f + GridStart;
}

} // namespace

Engine::Engine(const Arguments &arguments)
    : Platform::Application{arguments, NoCreate} {

  // Setup taichi
  std::cout << "Initialising taichi..." << std::endl;
  Tk_reset_c6_0(&Ti_ctx);
  std::cout << "Initialised taichi!" << std::endl;

  Tk_hub_get_num_particles_c10_0(&Ti_ctx);
  std::cout << "Number of particles: " << Ti_ctx.args[0].val_i32 << std::endl;

  // Test GL version
  // context

  // context_ = std::make_unique<Platform::GLContext>();

  // std::cout << "GLES200 supported: "
  //           << context_->isVersionSupported(GL::Version::GLES200)
  //           << std::endl;
  // std::cout << "GLES300 supported: "
  //           << context_->isVersionSupported(GL::Version::GLES300)
  //           << std::endl;

  // Setup window
  {
    const Vector2 dpiScaling = this->dpiScaling({});
    Configuration conf;
    conf.setTitle("Magnum 2D Fluid Simulation Example")
        .setSize(conf.size(), dpiScaling)
        .addWindowFlags(Configuration::WindowFlag::Resizable);
    GLConfiguration glConf;
    glConf.setVersion(GL::Version::GLES300);
    glConf.setSampleCount(dpiScaling.max() < 2.0f ? 8 : 2);
    if (!tryCreate(conf, glConf)) {
      create(conf, glConf.setSampleCount(0));
    }
  }

  // Setup scene objects and camera
  _scene.emplace();
  _drawableGroup.emplace();

  /* Configure camera */
  _objCamera.emplace(_scene.get());
  _objCamera->setTransformation(Matrix3::translation(gridCenter()));

  _camera.emplace(*_objCamera);
  _camera->setAspectRatioPolicy(SceneGraph::AspectRatioPolicy::Extend)
      .setProjectionMatrix(Matrix3::projection(Vector2{DomainDisplaySize}))
      .setViewport(GL::defaultFramebuffer.viewport().size());

  // Setup mpm sim data
  _drawableParticles.emplace(std::vector<Vector2>{{0.5, 0.5}, {0.5, 0.6}},
                             1.0f);

  GL::Renderer::enable(GL::Renderer::Feature::DepthTest);
#ifndef MAGNUM_TARGET_GLES
  GL::Renderer::enable(GL::Renderer::Feature::ProgramPointSize);
#endif

  // Start the timer and loop at max 60hz
  timeline_.start();
}

void Engine::drawEvent() {
  /* TODO: Move to dedicated running loop */
  std::cout << "substepping, previous frame duration: "
            << timeline_.previousFrameDuration() << std::endl;
  Tk_substep_c4_0(&Ti_ctx);

  /* TODO: Add your drawing code here */
  GL::defaultFramebuffer.clear(GL::FramebufferClear::Color |
                               GL::FramebufferClear::Depth);

  /* Draw objects */
  {
    /* Trigger drawable object to update the particles to the GPU */
    _drawableParticles->setDirty();
    _drawableParticles->draw(_camera,
                             GL::defaultFramebuffer.viewport().size().y(),
                             DomainDisplaySize.y());

    /* Draw other objects (boundary mesh, pointer mesh) */
    _camera->draw(*_drawableGroup);
  }

  swapBuffers();
  timeline_.nextFrame();

  // Run next frame immediately
  redraw();
}
} // namespace erosion

MAGNUM_APPLICATION_MAIN(erosion::Engine)

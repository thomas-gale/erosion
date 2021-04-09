#include <iostream>

#include <Corrade/Containers/Pointer.h>
#include <Magnum/GL/DefaultFramebuffer.h>
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

extern "C" {
#include "taichi/mpm88.py.h"
}

namespace erosion {

using namespace Magnum;
using Scene2D = SceneGraph::Scene<SceneGraph::MatrixTransformation2D>;
using Object2D = SceneGraph::Object<SceneGraph::MatrixTransformation2D>;

class Engine : public Platform::Application {
public:
  explicit Engine(const Arguments &arguments);

private:
  void drawEvent() override;

  /* Scene and drawable group must be constructed before camera and other
     drawble objects */
  Containers::Pointer<Scene2D> _scene;
  Containers::Pointer<SceneGraph::DrawableGroup2D> _drawableGroup;

  /* Camera helpers */
  Containers::Pointer<Object2D> _objCamera;
  Containers::Pointer<SceneGraph::Camera2D> _camera;

  Timeline timeline_;
};

Engine::Engine(const Arguments &arguments)
    : Platform::Application{arguments, NoCreate} {
  // Setup taichi
  std::cout << "Initialising taichi..." << std::endl;
  Tk_reset_c6_0(&Ti_ctx);
  std::cout << "Initialised taichi!" << std::endl;

  Tk_hub_get_num_particles_c10_0(&Ti_ctx);
  std::cout << "Number of particles: " << Ti_ctx.args[0].val_i32 << std::endl;

  timeline_.start();

  // Setup window
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

  // Setup scene objects and camera
  {
    _scene.emplace();
    _drawableGroup.emplace();

    /* Configure camera */
    _objCamera.emplace(_scene.get());
    // _objCamera->setTransformation(Matrix3::translation(gridCenter()));

    _camera.emplace(*_objCamera);
    // _camera->setAspectRatioPolicy(SceneGraph::AspectRatioPolicy::Extend)
    // .setProjectionMatrix(Matrix3::projection(Vector2{DomainDisplaySize}))
    // .setViewport(GL::defaultFramebuffer.viewport().size());
  }
}

void Engine::drawEvent() {
  /* TODO: Move to dedicated running loop */
  std::cout << "substepping, previous frame duration: "
            << timeline_.previousFrameDuration() << std::endl;
  Tk_substep_c4_0(&Ti_ctx);

  /* TODO: Add your drawing code here */
  GL::defaultFramebuffer.clear(GL::FramebufferClear::Color);

  swapBuffers();
}
} // namespace erosion

MAGNUM_APPLICATION_MAIN(erosion::Engine)

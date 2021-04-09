#include <iostream>

#include <Magnum/GL/DefaultFramebuffer.h>
#ifndef CORRADE_TARGET_EMSCRIPTEN
#include <Magnum/Platform/Sdl2Application.h>
#else
#include <Magnum/Platform/EmscriptenApplication.h>
#endif

extern "C" {
#include "taichi/mpm88.py.h"
}

using namespace Magnum;

class Engine : public Platform::Application {
public:
  explicit Engine(const Arguments &arguments);

private:
  void drawEvent() override;
};

Engine::Engine(const Arguments &arguments) : Platform::Application{arguments} {
  /* TODO: Add your initialization code here */

  std::cout << "Initialising taichi..." << std::endl;
  Tk_reset_c6_0(&Ti_ctx);
  std::cout << "Initialised taichi!" << std::endl;
}

void Engine::drawEvent() {
  GL::defaultFramebuffer.clear(GL::FramebufferClear::Color);

  /* TODO: Add your drawing code here */
  std::cout << "drawEvent!" << std::endl;

  swapBuffers();
}

MAGNUM_APPLICATION_MAIN(Engine)

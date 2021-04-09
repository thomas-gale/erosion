#include <emscripten.h>
#include <emscripten/bind.h>

#include "taichi/generated/mpm88.h"

int fib(int x) {
  if (x < 1) {
    return 0;
  }
  if (x == 1) {
    return 1;
  }
  return fib(x - 1) + fib(x - 2);
}

int mpm88() {
  Ti_Context ctx;
  Tk_init_c6_0(&ctx);
  return 0;
}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::function("fib", &fib);
  emscripten::function("mpm88", &mpm88);
}

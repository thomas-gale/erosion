#include "fib.hpp"
#include <emscripten/bind.h>

int fib(int x) {
  if (x < 1)
    return 0;
  if (x == 1)
    return 1;
  return fib(x - 1) + fib(x - 2);
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("fib", &fib);
}

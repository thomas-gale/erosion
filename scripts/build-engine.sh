#!/bin/bash
set -e

cd engine 

mkdir -p build && cd build
cmake .. \
    -DCMAKE_TOOLCHAIN_FILE=../toolchains/generic/Emscripten-wasm.cmake \
    -DCMAKE_PREFIX_PATH=~/emsdk/upstream/emscripten/system \
    -DCMAKE_INSTALL_PREFIX=../../public/magnum \
    -DCORRADE_RC_EXECUTABLE=../lib/corrade/src

cmake --build .
cmake --build . --target install

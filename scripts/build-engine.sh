#!/bin/bash
set -e

cd engine 

mkdir -p build && cd build
cmake .. \
    -DCMAKE_TOOLCHAIN_FILE=../toolchains/generic/Emscripten-wasm.cmake \
    #-DCMAKE_PREFIX_PATH=/home/vscode/emsdk/upstream/emscripten/system \
    -DCMAKE_INSTALL_PREFIX=../../public/magnum
cmake --build .
cmake --build . --target install
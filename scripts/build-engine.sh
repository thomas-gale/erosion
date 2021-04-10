#!/bin/bash
set -e

# generate taichi code
sudo docker build ./engine/lib/taichi.js -t taichihub
python3.8 ./scripts/taichi-c-generator.py

# build main magnum emscripten application.
cd engine 
mkdir -p build && cd build
cmake .. \
    -DCMAKE_TOOLCHAIN_FILE=../toolchains/generic/Emscripten-wasm.cmake \
    -DCMAKE_PREFIX_PATH=~/emsdk/upstream/emscripten/system \
    -DCMAKE_INSTALL_PREFIX=../../public/magnum \
    -DCORRADE_RC_EXECUTABLE=../corrade-rc/bin/corrade-rc

cmake --build .
cmake --build . --target install

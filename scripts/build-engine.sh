#!/bin/bash
set -e

# If the first argument is non-empty, this script will build a local sdl2 application
# rather than a webgl2 application

# generate taichi code
sudo docker build ./engine/lib/taichi.js -t taichihub
python3.8 ./scripts/taichi-c-generator.py

# build main magnum emscripten application.
cd engine 
mkdir -p build && cd build
mkdir -p install
cmake .. \
    -DLOCALTEST=$1 \
    -DCMAKE_TOOLCHAIN_FILE=../toolchains/generic/Emscripten-wasm.cmake \
    -DCMAKE_PREFIX_PATH=~/emsdk/upstream/emscripten/system \
    -DCMAKE_INSTALL_PREFIX=./install \
    -DCORRADE_RC_EXECUTABLE=../corrade-rc/bin/corrade-rc

cmake --build .
cmake --build . --target install
cd ../..

# copy built files to cra binding point
mkdir -p src/engine
find ./engine/build/install/ -name "*.wasm" -exec cp '{}' ./public/ \;
find ./engine/build/install/ -name "engine.js" -exec cp '{}' ./src/engine/ \;
find ./src/engine/ -name "engine.js" -exec sed -i '1i/* eslint-disable */' '{}' \;

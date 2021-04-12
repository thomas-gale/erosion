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
cd ../..

# copy built files to cra binding point
mkdir -p src/engine
find ./public/magnum/ -name "*.wasm" -exec cp '{}' ./public/ \;
find ./public/magnum/ -name "engine.js" -exec cp '{}' ./src/engine/ \;
find ./src/engine/ -name "engine.js" -exec sed -i '1i/* eslint-disable */' '{}' \;
rm -r ./public/magnum

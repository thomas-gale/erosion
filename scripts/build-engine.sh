#!/bin/bash
set -e

# Default value is debug
if [ $1 = ""]; then
$1 = Debug
fi

export BUILD_TYPE=$1
if [ ${BUILD_TYPE} = Debug ]; then
# export EMCC_DEBUG=1
echo "Maybe enable verbose debug output"
fi

# generate taichi code
sudo docker build ./engine/lib/taichi.js -t taichihub
python3.8 ./scripts/taichi-c-generator.py

# build main magnum emscripten application (enabling debugging for now)
cd engine 
mkdir -p build && cd build
# mkdir -p install
cmake .. \
    -DCMAKE_BUILD_TYPE=${BUILD_TYPE} \
    -DCMAKE_TOOLCHAIN_FILE=../toolchains/generic/Emscripten-wasm.cmake \
    -DCMAKE_PREFIX_PATH=~/emsdk/upstream/emscripten/system \
    -DCORRADE_RC_EXECUTABLE=../corrade-rc/bin/corrade-rc

cmake --build .
# cmake --build . --target install
cd ../..

# copy built files to cra binding point
find ./engine/build/${BUILD_TYPE}/bin/ -name "*.wasm" -exec cp '{}' ./public/ \;
mkdir -p src/engine
find ./engine/build/${BUILD_TYPE}/bin/ -name "engine.js" -exec cp '{}' ./src/engine/ \;
find ./src/engine/ -name "engine.js" -exec sed -i '1i/* eslint-disable */' '{}' \;

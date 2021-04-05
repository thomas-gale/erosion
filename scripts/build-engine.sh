#!/bin/bash
set -e

# Build files
# mkdir -p build-engine
# cd build-engine
# emcmake cmake ../src-engine/
# make
# cd ..

# Build files, non cmake
mkdir -p build-engine
cd build-engine
# em++ ../src-engine/test.cpp -o test.js -s WASM=0 -s ENVIRONMENT=web -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s MODULARIZE=1
# emcc ../src-engine/test.cpp -o test.js --bind -s WASM=1 -s MODULARIZE=-s WASM=1 -s MODULARIZE=1
# em++ ../src-engine/test.cpp ../src-engine/fib.cpp -o test.js -s WASM=1 -s EXPORT_ALL=1 || exit 1
# em++ ../src-engine/test.cpp ../src-engine/fib.cpp -o test.js -s WASM=1 -s EXPORT_ALL=1 --bind || exit 1
em++ ../src-engine/fib.cpp -o test.js -s WASM=1 -s EXPORT_ALL=1 -s ENVIRONMENT=web -s MODULARIZE=1 --bind || exit 1

cd ..

# Copy built files to CRA binding point
mkdir -p src/engine
cd build-engine 

find . -name "*.wasm" -exec cp '{}' ../src/engine/ \;
find . -name "*.js" -exec cp '{}' ../src/engine/ \;
find ../src/engine/ -name "*.js" -exec sed -i '1i/* eslint-disable */' '{}' \;

find . -name "*.wasm" -exec cp '{}' ../public/ \;
# find . -name "*.js" -exec cp '{}' ../public/ \;
cd ..

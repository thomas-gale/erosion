#!/bin/bash
set -e

# Build files
mkdir -p build-engine
cd build-engine
emcmake cmake ../src-engine/
make
cd ..

# Copy built files to CRA binding point
mkdir -p src/engine
cd build-engine 
find . -name "*.wasm" -exec mv '{}' ../src/engine/ \;
find . -name "*.js" -exec mv '{}' ../src/engine/ \;
cd ..

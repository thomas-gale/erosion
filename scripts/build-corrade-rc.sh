#!/bin/bash
set -e

# output
mkdir -p engine/corrade-rc
INSTALL_PRE=$(pwd)/engine/corrade-rc

# build
cd engine/lib/corrade
mkdir -p build
cd build
cmake -DCMAKE_INSTALL_PREFIX=$INSTALL_PRE ..
make
sudo make install # sudo may be needed

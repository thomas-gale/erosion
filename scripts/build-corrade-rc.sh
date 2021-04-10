#!/bin/bash
set -e

cd engine/lib/corrade
mkdir -p build
cd build
cmake -DCMAKE_INSTALL_PREFIX=/usr ..
make
sudo make install # sudo may be needed
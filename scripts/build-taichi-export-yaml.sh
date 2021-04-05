#!/bin/bash
set -e

mkdir -p ./src-engine/taichi/generated
TI_ARCH=cc TI_ACTION_RECORD=./src-engine/taichi/generated/mpm88.yml python3 ./src-engine/taichi/mpm88.py

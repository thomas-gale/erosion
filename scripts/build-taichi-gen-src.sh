#!/bin/bash
set -e

python3 -m taichi cc_compose ./src-engine/taichi/generated/mpm88.yml ./src-engine/taichi/generated/mpm88.c ./src-engine/taichi/generated/mpm88.h

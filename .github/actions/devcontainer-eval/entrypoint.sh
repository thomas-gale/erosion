#!/bin/bash
set -e

echo "** devcontainer-eval **"
pwd
echo "** to execute: $1 **"
eval $1

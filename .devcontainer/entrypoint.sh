#!/bin/bash
set -e

# Check if running in GitHub vs locally
if [ -n "$GITHUB_ACTIONS" ]
then
  echo "** Running github action script **"
  echo "run /build.sh etc..."
  echo "** **"
fi

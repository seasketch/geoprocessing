#!/usr/bin/env bash
# Setup env vars and create empty build directories
export PROJECT_PATH=$(pwd)
set -e
echo ""
rm -rf .build
mkdir .build
# Determine correct path. Need to be in @seasketch/geoprocessing root
if test -f "../geoprocessing/scripts/build/build.sh"; then
  # in monorepo
  cd ../geoprocessing
else
  # production reporting tool
  cd node_modules/@seasketch/geoprocessing
fi
rm -rf .build
mkdir .build

rm -rf $PROJECT_PATH/.build
mkdir $PROJECT_PATH/.build

# Create lambda functions and manifest
ANALYZE=$ANALYZE NOMINIFY=$NOMINIFY NODE_PATH=$PROJECT_PATH/node_modules npx tsx scripts/build/build.ts
if test -d ".build"; then
  # Copy to the project's .build directory
  cp -R .build/* $PROJECT_PATH/.build/
fi
# Cleanup 
rm -rf .build

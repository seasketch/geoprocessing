#!/usr/bin/env bash
# Setup env vars and build directories
export PROJECT_PATH=$(pwd)
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

# Create lambda handler functions
rollup -c scripts/build/rollup.functions.config.js
# Copy files and all node_modules related to handlers
cp -R .build/* $PROJECT_PATH/.build/
mkdir $PROJECT_PATH/.build/node_modules
cp -R node_modules/@turf $PROJECT_PATH/.build/node_modules/
cp -R node_modules/uuid $PROJECT_PATH/.build/node_modules/
npx copy-node-modules $PROJECT_PATH $PROJECT_PATH/.build/
rm -rf $PROJECT_PATH/.build/node_modules/@seasketch/geoprocessing

# Extract metadata from handlers and create a manifest file
node dist/scripts/build/createManifest.js

# Build high-level services for the geoprocessing apis
rollup -c scripts/build/rollup.services.config.js
cp .build/serviceHandlers.js $PROJECT_PATH/.build/

# Cleanup 
rm -rf .build

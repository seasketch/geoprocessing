#!/usr/bin/env bash
# Setup env vars and build directories
export PROJECT_PATH=$(pwd)
set -e
rm -rf .build
echo "Building lambda functions..."
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
npx rollup -c scripts/build/rollup.functions.config.js
# Copy files and all node_modules related to handlers
cp -R .build/* $PROJECT_PATH/.build/
mkdir $PROJECT_PATH/.build/node_modules
export WORKING_DIR=$(pwd)
cd $PROJECT_PATH/.build
npm install --silent @turf/area uuid node-fetch node-abort-controller
cd $WORKING_DIR
echo 'Copying node modules'
npx copy-node-modules $PROJECT_PATH $PROJECT_PATH/.build/ -f @seasketch/geoprocessing
echo 'Deleting extra node modules'
rm -rf $PROJECT_PATH/.build/node_modules/@seasketch/geoprocessing
echo 'Creating manifest'
# Extract metadata from handlers and create a manifest file
node dist/scripts/build/createManifest.js

# Build high-level services for the geoprocessing apis
npx rollup -c scripts/build/rollup.services.config.js
cp .build/serviceHandlers.js $PROJECT_PATH/.build/

# Cleanup 
rm -rf .build

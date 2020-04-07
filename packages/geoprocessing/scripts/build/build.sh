#!/usr/bin/env bash
# Setup env vars and build directories
export PROJECT_PATH=$(pwd)
set -e
echo "Building lambda functions..."
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

# Create lambda handler functions
npx webpack --config scripts/build/webpack.functions.config.js
# Create json representation of service endpoints and resources
node dist/scripts/build/createManifest.js
# Copy to the project's .build directory
cp -R .build/* $PROJECT_PATH/.build/
# Copy node_modules related to handlers
mkdir $PROJECT_PATH/.build/node_modules
npx copy-node-modules $PROJECT_PATH $PROJECT_PATH/.build/
# Cleanup 
rm -rf .build

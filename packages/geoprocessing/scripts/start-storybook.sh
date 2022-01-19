#!/usr/bin/env bash
# Setup env vars and build directories
export PROJECT_PATH=$(pwd)
# Determine correct path. Need to be in @seasketch/geoprocessing root
if test -f "../geoprocessing/scripts/start-storybook.sh"; then
  # in monorepo
  cd ../geoprocessing
else
  # production reporting tool
  cd node_modules/@seasketch/geoprocessing
fi
npm run start-storybook
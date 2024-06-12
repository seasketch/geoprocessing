#!/usr/bin/env bash
set -e
export PROJECT_PATH=$(pwd)
# Determine correct path. Need to be in @seasketch/geoprocessing root
if test -f "../geoprocessing/scripts/build/build.sh"; then
  # in monorepo
  cd ../geoprocessing
  export GP_ROOT=$(pwd)
else
  # production reporting tool
  cd node_modules/@seasketch/geoprocessing
  export GP_ROOT=$(pwd)
fi
npx aws-cdk --app "node dist/scripts/deploy/createStack.js" --outputs-file ../../../cdk-outputs.json --require-approval never deploy
node dist/scripts/deploy/fixIndexHtmlCacheControl.js

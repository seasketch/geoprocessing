#!/usr/bin/env bash
set -e
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
npx aws-cdk --app "node dist/scripts/deploy/createStack.js" --outputs-file ../../../cdk-outputs.json --require-approval never deploy
node dist/scripts/deploy/fixIndexHtmlCacheControl.js
node dist/scripts/deploy/beep_when_done.js

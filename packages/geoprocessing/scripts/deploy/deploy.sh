#!/usr/bin/env bash
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
npx cdk --app "node dist/scripts/deploy/createStack.js" --require-approval never deploy
node dist/scripts/deploy/fixIndexHtmlCacheControl.js
node dist/scripts/deploy/beep_when_done.js

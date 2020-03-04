#!/usr/bin/env bash
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
npx cdk --app "node dist/scripts/deploy/createStack.js" deploy
node scripts/deploy/fixIndexHtmlCacheControl.js

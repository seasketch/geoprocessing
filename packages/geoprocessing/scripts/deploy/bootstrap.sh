#!/usr/bin/env bash
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
$(npm bin)/cdk --app "node dist/scripts/deploy/createStack.js" bootstrap

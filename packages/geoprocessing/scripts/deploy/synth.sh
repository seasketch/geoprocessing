#!/usr/bin/env bash
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
npx aws-cdk@2.x --app "node dist/scripts/deploy/createStack.js" synthesize
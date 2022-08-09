#!/usr/bin/env bash
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
npx aws-cdk destroy --force --app "node dist/scripts/deploy/createStack.js"


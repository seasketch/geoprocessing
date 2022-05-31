#!/usr/bin/env bash
export PROJECT_PATH=$(pwd)
cd node_modules/@seasketch/geoprocessing
npx aws-cdk@1.x --app "node dist/scripts/deploy/createStackV1.js" synthesize
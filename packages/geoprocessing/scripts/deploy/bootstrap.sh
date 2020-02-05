#!/usr/bin/env bash
if test -f "node_modules/aws-cdk/bin/cdk"; then
  node_modules/aws-cdk/bin/cdk --app "npx ts-node node_modules/@seasketch/geoprocessing/src/infra/createStack.ts" bootstrap
elif test -f "node_modules/@seasketch/geoprocessing/node_modules/aws-cdk/bin/cdk"; then
  node_modules/@seasketch/geoprocessing/node_modules/aws-cdk/bin/cdk --app "npx ts-node node_modules/@seasketch/geoprocessing/src/infra/createStack.ts" bootstrap
fi
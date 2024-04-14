export PROJECT_PATH=$(pwd)
set -e
echo ""
rm -rf .build-web
mkdir .build-web
cp -r src/i18n/lang .build-web
cp -r src/i18n/baseLang .build-web
# Determine correct path. Need to be in @seasketch/geoprocessing root
if test -f "../geoprocessing/scripts/build/build-client.sh"; then
  # in monorepo
  # cd ../geoprocessing
  npx tsx ../geoprocessing/scripts/build/buildClient.ts
  cp ../geoprocessing/src/assets/favicon.ico $PROJECT_PATH/.build-web/
else
  # production reporting tool
  # cd node_modules/@seasketch/geoprocessing
  npx tsx node_modules/@seasketch/geoprocessing/scripts/build/buildClient.ts
  cp node_modules/@seasketch/geoprocessing/src/assets/favicon.ico $PROJECT_PATH/.build-web/
fi

echo ""

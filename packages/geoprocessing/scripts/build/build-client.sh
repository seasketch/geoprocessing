export PROJECT_PATH=$(pwd)
set -e
echo ""
rm -rf .build-web
mkdir .build-web
cp -r src/i18n/lang .build-web
cp -r src/i18n/baseLang .build-web

# Determine path to @seasketch/geoprocessing root
GP_PATH=GP_NOT_FOUND
if test -f "../geoprocessing/scripts/build/build-client.sh"; then
  # in monorepo
  GP_PATH=../geoprocessing
else
  # production reporting tool
  GP_PATH=node_modules/@seasketch/geoprocessing
fi

ANALYZE=$ANALYZE NOMINIFY=$NOMINIFY npx tsx $GP_PATH/scripts/build/buildClient.ts
cp $G_PATH/src/assets/favicon.ico $PROJECT_PATH/.build-web/

echo ""

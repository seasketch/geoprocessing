export PROJECT_PATH=$(pwd)
set -e
echo ""
rm -rf .build-web
mkdir .build-web

# Determine path to @seasketch/geoprocessing root.  Running script from gp folder will use its dependencies
GP_PATH=GP_NOT_FOUND
export PROJECT_RELATIVE_PATH_BACK=NOT_AVAILABLE
if test -f "../geoprocessing/scripts/build/build-client.sh"; then
  # in monorepo
  GP_PATH=../geoprocessing
else
  # production reporting tool
  GP_PATH=node_modules/@seasketch/geoprocessing
fi

cd "$GP_PATH"

ANALYZE=$ANALYZE NOMINIFY=$NOMINIFY npx tsx scripts/build/buildClient.ts
cp $GP_PATH/src/assets/favicon.ico $PROJECT_PATH/.build-web/dist/assets

cp -r $PROJECT_PATH/src/i18n/lang $PROJECT_PATH/.build-web/dist/assets
cp -r $PROJECT_PATH/src/i18n/baseLang $PROJECT_PATH/.build-web/dist/assets

echo ""

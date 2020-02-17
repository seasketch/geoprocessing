export PROJECT_PATH=$(pwd)
rm -rf .build-web
# Determine correct path. Need to be in @seasketch/geoprocessing root
if test -f "../geoprocessing/scripts/build/build-client.sh"; then
  # in monorepo
  cd ../geoprocessing
else
  # production reporting tool
  cd node_modules/@seasketch/geoprocessing
fi
# Build client
echo "Building client..."
rm -rf .build-web
npx webpack --config scripts/build/webpack.config.js
mv .build-web $PROJECT_PATH/
cp src/favicon.ico $PROJECT_PATH/.build-web/

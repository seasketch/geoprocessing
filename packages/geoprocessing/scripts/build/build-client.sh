export PROJECT_PATH=$(pwd)
export NODE_OPTIONS=--openssl-legacy-provider
set -e
echo ""
echo "Building client..."
echo ""
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
rm -rf .build-web
npx webpack --config scripts/build/webpack.clients.config.cjs
mv .build-web $PROJECT_PATH/
cp src/assets/favicon.ico $PROJECT_PATH/.build-web/
echo ""

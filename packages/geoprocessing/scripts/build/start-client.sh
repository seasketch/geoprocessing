export PROJECT_PATH=$(pwd)
set -e
echo ""
echo "Starting client dev server..."
echo ""
# Determine correct path. Need to be in @seasketch/geoprocessing root
if test -f "../geoprocessing/scripts/build/start-client.sh"; then
  # in monorepo
  cd ../geoprocessing
else
  # production reporting tool
  cd node_modules/@seasketch/geoprocessing
fi
DEBUG='express:*' npx webpack serve --config scripts/build/webpack.clients.config.js --mode="development" --client-logging verbose --progress --watch-files "${PROJECT_PATH}/src"
echo ""

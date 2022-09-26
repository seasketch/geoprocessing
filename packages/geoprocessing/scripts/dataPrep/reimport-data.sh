export PROJECT_PATH=$(pwd)
set -e

echo "PROJECT_PATH: $PROJECT_PATH"
echo "Datasource matcher: $2"

# Default to assuming running from project, but check if running from within monorepo like example project
GP_PATH="node_modules/@seasketch/geoprocessing"
if test -f "$GP_PATH"; then
    GP_PATH="../geoprocessing"
fi

echo ""
echo "Starting local data server for raster import..."
echo ""

# Run web server, then script, and kill both when done
npx http-server "$PROJECT_PATH/data/dist" -s -p 8001 & node "${GP_PATH}/dist/scripts/dataPrep/reimportData.js" $PROJECT_PATH $2 && kill $!

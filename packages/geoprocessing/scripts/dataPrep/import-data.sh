export PROJECT_PATH=$(pwd)
set -e
echo ""
echo "Starting local data server..."
echo ""

echo "PROJECT_PATH"
echo "$PROJECT_PATH"

# Default to assuming running from project, but check if running from within monorepo like example project
GP_PATH="node_modules/@seasketch/geoprocessing"
if test -f "$GP_PATH"; then
    GP_PATH="../geoprocessing"
fi
echo "GP_PATH: ${GP_PATH}"

# Run web server, then script, and kill both when done
npx http-server "$PROJECT_PATH/data/dist" -p 8001 & node "${GP_PATH}/dist/scripts/dataPrep/importData.js $PROJECT_PATH" && kill $!

export PROJECT_PATH=$(pwd)
set -e
echo ""
echo "Starting local data server..."
echo ""
echo "$PROJECT_PATH"
npx http-server "$PROJECT_PATH/data/dist" -p 8001

# Default to assuming running from project, but check if running from within monorepo like example project
GP_PATH="node_modules/@seasketch/geoprocessing" && [[ test -f "../geoprocessing/scripts/dataPrep/import-data.sh" ]] && GP_PATH="../geoprocessing"

# Determine correct path. Need to be in @seasketch/geoprocessing root
# if test -f "../geoprocessing/scripts/dataPrep/import-data.sh"; then
#   # in monorepo
#   cd ../geoprocessing
# else
#   # production reporting tool
#   cd node_modules/@seasketch/geoprocessing
# fi
node "${GP_PATH}/dist/scripts/dataPrep/importData.js "$PROJECT_PATH"
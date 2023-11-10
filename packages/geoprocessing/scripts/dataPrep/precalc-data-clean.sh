export PROJECT_PATH=$(pwd)
set -e

echo "PROJECT_PATH: $PROJECT_PATH"

# Default to assuming running from project, but check if running from within monorepo like example project
GP_PATH="node_modules/@seasketch/geoprocessing"
if test -f "$GP_PATH"; then
    GP_PATH="../geoprocessing"
fi

node "${GP_PATH}/dist/scripts/dataPrep/precalcDataClean.js" $PROJECT_PATH

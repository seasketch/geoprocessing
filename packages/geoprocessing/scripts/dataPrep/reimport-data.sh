export PROJECT_PATH=$(pwd)
set -e
PORT=8001

echo "PROJECT_PATH: $PROJECT_PATH"

# Default to assuming running from installed project, but check if running from within monorepo like example project
INSTALLED_GP_PATH="node_modules/@seasketch/geoprocessing"
MONOREPO_GP_PATH="../geoprocessing"
GP_PATH=$INSTALLED_GP_PATH

if test -d "$INSTALLED_GP_PATH"; then
    GP_PATH=$INSTALLED_GP_PATH
elif test -d "$MONOREPO_GP_PATH"; then
    GP_PATH=$MONOREPO_GP_PATH
fi

node "${GP_PATH}/dist/scripts/dataPrep/reimportData.js" $PROJECT_PATH

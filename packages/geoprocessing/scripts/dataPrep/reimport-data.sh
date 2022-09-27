export PROJECT_PATH=$(pwd)
set -e
PORT=8001

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

# Run web server, then script, and kill both when done or if exit early
onINT() {
echo "You exited early, killing server listening on port ${PORT} at PID $command1PID"
kill -INT "$command1PID"
exit
}

trap "onINT" SIGINT
npx http-server "$PROJECT_PATH/data/dist" -s -p ${PORT} &
command1PID="$!"
node "${GP_PATH}/dist/scripts/dataPrep/reimportData.js" $PROJECT_PATH $2
echo Done


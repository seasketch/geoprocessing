#!/bin/bash
# Generates GeoJSON in EPSG:4326

if [ "$#" != 5 ]; then
    echo "Missing arguments.  Usage: genGeojson [SRC_PATH] [DST_PATH] [DATASOURCE_ID] [SQL_QUERY] [OPTIONS]"
    exit
fi

echo "Generate GeoJSON"
SRC_PATH=$1
DST_PATH=$2
DATASOURCE_ID=$3
SQL_QUERY=$4
OPTIONS=$5

echo "SRC_PATH: $1"
echo "DST_PATH: $2"
echo "DATASOURCE_ID: $3"
echo "SQL_QUERY: $4"
echo "OPTIONS: $5"

# Print each command before executing
set -o xtrace

rm -f ${DST_PATH}/${DATASOURCE_ID}.fgb
ogr2ogr -t_srs "EPSG:4326" -f GeoJSON ${OPTIONS} -dialect OGRSQL -sql "${SQL_QUERY}" ${DST_PATH}/${DATASOURCE_ID}.json ${SRC_PATH}

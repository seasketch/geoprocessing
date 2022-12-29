#!/bin/bash
# Generates a COG in EPSG:4326

if [ "$#" != 4 ]; then
    echo "Missing arguments.  Usage: genCog [SRC_PATH] [DST_PATH] [DATASOURCE_ID] [BAND]"
    exit
fi

echo "Generate cloud-optimized GeoTIFF"
SRC_PATH=$1
DST_PATH=$2
DATASOURCE_ID=$3
BAND=$4

# echo "SRC_PATH: $1"
# echo "DST_PATH: $2"
# echo "DATASOURCE_ID: $3"
# echo "BAND: $4"

# Print each command before executing
set -o xtrace

gdalwarp -t_srs "EPSG:4326" "${SRC_PATH}" "${DST_PATH}/${DATASOURCE_ID}_4326.tif"
gdal_translate -b ${BAND} -r nearest -of COG -stats "${DST_PATH}/${DATASOURCE_ID}_4326.tif" "${DST_PATH}/${DATASOURCE_ID}.tif"
rm ${DST_PATH}/${DATASOURCE_ID}_4326*

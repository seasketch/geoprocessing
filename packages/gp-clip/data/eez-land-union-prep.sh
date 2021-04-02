#!/bin/bash

# Download from https://marineregions.org/download_file.php?name=EEZ_land_union_v3_202003.zip and move into this folder
if [ ! -d "src/EEZ_land_union_v3_202003" ]; then
  unzip EEZ_land_union_v3_202003.zip
fi

# Import
shp2pgsql -D -s 4326 src/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.shp eez_land_union | psql

# Create spatial index
psql -t <<SQL
  CREATE INDEX ON eez_land_union USING gist(geom);
SQL

# Subdivide into new table land_subdivided
psql -f eez-land-union-subdivide.sql

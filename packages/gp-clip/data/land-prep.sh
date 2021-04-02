#!/bin/bash

# Download and unpack
if [ ! -d "src/land-polygons-complete-4326.zip"]; then
  wget https://osmdata.openstreetmap.de/download/land-polygons-complete-4326.zip
fi
if [ ! -d "src/land-polygons-complete-4326" ]; then
  unzip land-polygons-complete-4326.zip
fi

# Import
shp2pgsql -D -s 4326 src/land-polygons-complete-4326/land_polygons.shp land | psql

# Create spatial index
psql -t <<SQL
  CREATE INDEX ON land USING gist(geom);
SQL

# Subdivide into new table land_subdivided
psql -f ./land-subdivide.sql

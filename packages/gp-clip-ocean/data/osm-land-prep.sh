#!/bin/bash

# Download and unpack
if [ ! -f "src/land-polygons-complete-4326.zip" ]; then
  (cd src && curl -O https://osmdata.openstreetmap.de/download/land-polygons-complete-4326.zip)
fi

if [ ! -d "src/land-polygons-complete-4326" ]; then
  unzip src/land-polygons-complete-4326.zip -d src
fi

if [ -d "src/land-polygons-complete-4326" ]; then
  # Import
  shp2pgsql -D -s 4326 src/land-polygons-complete-4326/land_polygons.shp osm_land | psql

  # Create spatial index
  psql -t <<SQL
  CREATE INDEX ON land USING gist(geom);
SQL

  # Subdivide into new table
  psql -f ./osm-land-subdivide.sql
else
  echo "Unable to load data, download failed"
fi

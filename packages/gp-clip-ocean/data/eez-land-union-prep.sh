#!/bin/bash

psql -t <<SQL
  DROP TABLE eez_land_union;
  DROP TABLE eez_land_union_final;
  DROP TABLE eez_land_union_final_bundles;
SQL

# Download from https://marineregions.org/download_file.php?name=EEZ_land_union_v3_202003.zip and move into this folder
if [ ! -d "src/EEZ_land_union_v3_202003" ]; then
  unzip EEZ_land_union_v3_202003.zip
fi

# Import, keeping column name casing intact, and setting the SRID field to 4326
shp2pgsql -D -k -s 4326 src/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.shp eez_land_union | psql

# Create spatial index
psql -t <<SQL
  CREATE INDEX ON eez_land_union USING gist(geom);
SQL

# Subdivide into new table land_subdivided
psql -f eez-land-union.sql

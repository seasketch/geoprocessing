source ./.env

# Publish to s3.  Defaults to dry-run, remove to actually publish
AWS_REGION=us-west-2 npx geoprocessing bundle-features global-clipping-osm-land-polygons land_subdivided \
   --connection "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}" \
   --points-limit 4500 \
   --envelope-max-distance 200 --dry-run
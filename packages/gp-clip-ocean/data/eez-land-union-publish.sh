source ../../gp-workspace/.env

# Publish to s3.  Defaults to dry-run, remove to actually publish
AWS_REGION=us-west-2 npx geoprocessing bundle-features global-clipping-eez-land-union eez_land_union_final \
   --connection "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}" \
   --points-limit 60000
   # --envelope-max-distance 200
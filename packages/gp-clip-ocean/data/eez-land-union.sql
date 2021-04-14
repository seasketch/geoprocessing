BEGIN;
DROP TABLE IF EXISTS eez_land_union_final;

-- Create new table for subdivided polygons
-- union field is kept to allow customization of use/behavior per union boundary
CREATE TABLE eez_land_union_final (
  gid serial PRIMARY KEY,
  geom geometry(Polygon, 4326),
  "UNION" text NOT NULL
);

-- expand multipolygons into polygons
INSERT INTO eez_land_union_final (geom, "UNION")
SELECT
  geom,
  "UNION"
FROM (
  SELECT
    (st_dump(geom)).geom AS geom,
    gid,
    "UNION"
  FROM
    eez_land_union
  -- Optional filter of land polys that intersect polygon area of interest
  -- WHERE ST_Intersects(geom, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-82.957763671875,7.841615185204699],[-82.672119140625,7.9613174191889575],[-82.44140625,8.895925996417885],[-82.6171875,9.286464684304082],[-82.33154296875,9.622414142924805],[-83.46313476562499,11.092165893502],[-85.078125,11.296934440596322],[-85.69335937499999,11.329253026617318],[-86.044921875,11.016688524459864],[-86.187744140625,10.703791711680736],[-85.308837890625,9.373192635083441],[-82.957763671875,7.841615185204699]]]}'))
) AS eez_land_union_final;

-- Unioning of subdivided EEZ boundaries currently produces errors in some test cases so use this method at your own risk for now
-- subdivide only features over 512 points by deleting and re-inserting new

-- WITH complex_areas_to_subdivide AS (
--     DELETE FROM eez_land_union_final
--     WHERE ST_NPoints(geom) > 256
--     returning gid, geom, "UNION"
-- )

-- INSERT INTO eez_land_union_final (geom, "UNION")
--     SELECT * from (
--       SELECT
--           ST_Subdivide(geom, 256) AS geom,
--           "UNION"
--       FROM complex_areas_to_subdivide
--     ) as polys
--     -- Optional filter of land polys that intersect polygon area of interest
--     -- WHERE ST_Intersects(geom, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-82.957763671875,7.841615185204699],[-82.672119140625,7.9613174191889575],[-82.44140625,8.895925996417885],[-82.6171875,9.286464684304082],[-82.33154296875,9.622414142924805],[-83.46313476562499,11.092165893502],[-85.078125,11.296934440596322],[-85.69335937499999,11.329253026617318],[-86.044921875,11.016688524459864],[-86.187744140625,10.703791711680736],[-85.308837890625,9.373192635083441],[-82.957763671875,7.841615185204699]]]}'));
--     ;
COMMIT;

CREATE INDEX ON eez_land_union_final USING gist(geom);

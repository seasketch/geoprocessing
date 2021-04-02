BEGIN;
DROP TABLE IF EXISTS land_subdivided;

-- Create new table for subdivided polygons
CREATE TABLE land_subdivided (
  gid serial PRIMARY KEY,
  geom geometry(Polygon, 4326)
);

-- expand multipolygons into polygons
INSERT INTO land_subdivided (geom)
SELECT
  geom
FROM (
  SELECT
    (st_dump(geom)).geom AS geom,
    gid
  FROM
    land
  -- Optional filter of land polys that intersect polygon area of interest
  -- WHERE ST_Intersects(geom, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-82.957763671875,7.841615185204699],[-82.672119140625,7.9613174191889575],[-82.44140625,8.895925996417885],[-82.6171875,9.286464684304082],[-82.33154296875,9.622414142924805],[-83.46313476562499,11.092165893502],[-85.078125,11.296934440596322],[-85.69335937499999,11.329253026617318],[-86.044921875,11.016688524459864],[-86.187744140625,10.703791711680736],[-85.308837890625,9.373192635083441],[-82.957763671875,7.841615185204699]]]}'))
) AS land;

-- subdivide only features over 512 points by deleting and re-inserting new
WITH complex_areas_to_subdivide AS (
    DELETE FROM land_subdivided
    WHERE ST_NPoints(geom) > 512
    returning gid, geom
)

INSERT INTO land_subdivided (geom)
    SELECT * from (
      SELECT
          ST_Subdivide(geom, 512) AS geom
      FROM complex_areas_to_subdivide
    ) as complex
    -- Optional filter of land polys that intersect polygon area of interest
    -- WHERE ST_Intersects(geom, ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-82.957763671875,7.841615185204699],[-82.672119140625,7.9613174191889575],[-82.44140625,8.895925996417885],[-82.6171875,9.286464684304082],[-82.33154296875,9.622414142924805],[-83.46313476562499,11.092165893502],[-85.078125,11.296934440596322],[-85.69335937499999,11.329253026617318],[-86.044921875,11.016688524459864],[-86.187744140625,10.703791711680736],[-85.308837890625,9.373192635083441],[-82.957763671875,7.841615185204699]]]}'));
    ;
COMMIT;

CREATE INDEX ON land_subdivided USING gist(geom);

# Data Import

## Vector

Vector datasets can be any format supported by [GDAL](https://gdal.org/drivers/vector/index.html) "out of the box". Common formats include:

- GeoJSON
- GeoPackage
- Shapefile
- File Geodatabase

Importing a vector dataset into your project will:

- Reproject the dataset to the WGS84 spherical coordinate system, aka EPSG:4326.
- Transform the dataset into one or more formats including the [flatgeobuf](https://flatgeobuf.org/) cloud-optimized format and GeoJSON
- Strip out any unnecessary feature properties (to reduce file size)
- Optionally, expand multi-part geometries into single part
- Calculates overall statistics including total area, and area by group property
- Output the result to the `data/dist` directory, ready for testing
- Add datasource to `project/datasource.json`

If your dataset contains one or more properties that classify the vector features into one or more categories, and you want to report on those categories in your reports, then you can enter those properties now as a comma-separated list. For example a coral reef dataset containing a `type` property that identifies the type of coral present in each polygon. In the case of our EEZ dataset, there are no properties like this so press Enter to continue without.

By default, all extraneous properties will be removed from your vector dataset on import in order to make it as small as possible. Any additional properties that you want to keep in should be specified in this next question. If there are none, just press Enter.

Mulitpolygons can be split into polygons for analysis, which can help report performance.

Typically you only need to published Flatgeobuf data, which is cloud-optimized so that geoprocessing functions can fetch features for just the window of data they need (such as the bounding box of a sketch). Flatgeobuf is automatically created. GeoJSON is also available if you want to be able to import data directly in your geoprocessing function typescript files, or inspect the data using a human readable format. Just press enter if you are happy with the default.

If you want to use your data in analytics, respond `Yes` to allow precalculation.

## Raster

Importing a raster dataset into your project will:

- Reproject the data to an equal area projection called WGS 84 / NSIDC EASE-Grid 2.0 Global, aka EPSG:6933.
- Extract a single band of data
- Transform the raster into a [cloud-optimized GeoTIFF](https://www.cogeo.org/)
- Calculates overall statistics including total count and if categorical raster, a count per category
- Output the result to the `data/dist` directory, ready for testing
- Add datasource to `project/datasource.json`

Raster datasets can be any format supported by [GDAL](https://gdal.org/drivers/raster/index.html) "out of the box". Common formats include:

- GeoTIFF

`Quantitative` - measures one thing. This could be a binary 0 or 1 value thatidentifies the presence or absence of something, or a value that varies over the geographic surface such as temperature.
`Categorical` - measures presence/absence of multiple groups. The value of each cell in the band is a numeric group identifier, and thus each cell can represent one and only one group at a time.

## Subdividing Large Datasets

If you have very large polygons in your dataset (think country or global data), it will limit the efficiencies of the flatgeobuf format for fetching subsets of data using a bounding box.

[Subdividing](https://blog.cleverelephant.ca/2019/11/subdivide.html) is a solution for breaking up your data into smaller pieces along clearcut lines without overlap.

![subdivision process](https://user-images.githubusercontent.com/511063/79161015-a0375e80-7d8f-11ea-87a9-0658777f2f90.jpg)

Once you've imported and published your subdivided dataset, the flatgeobuf client will automatically the subset of polygon pieces that overlap with your requested bounding box. Clip operations such as intersection and difference should work properly because the pieces are aligned to each other without overlap.

How to subdivide data:

- QGIS Subdivide
- [Spatialite Subdivide](https://www.gaia-gis.it/fossil/libspatialite/wiki?name=About+ST_Subdivide%28%29) can be used with the [ogr2ogr](https://gdal.org/en/stable/drivers/vector/sqlite.html) command.

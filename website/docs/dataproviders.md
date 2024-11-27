# Data Providers

## Fetching Data

### Vector Data Fetching

The flatgeobuf library offers a low-level `deserialize` function for fetching features from a flatgeobuf file hosted at a url.

The geoprocessing framework offers some convenience functions that provide addtional functionality and access to more formats.

- `getFeaturesForSketchBBoxes` - loads features from a FlatGeobuf referenced by URL, which intersect the bounding boxes of each individual sketch in a SketchCollection, or a single Sketch.
  - This is the best way to fetch features overlapping with a Sketch or Sketch Collection. Built-in antimeridian support.
- `loadFgb` - fetch vector features from flatgeobuf at url that intersect with a bounding box. Awaits all features before returning, rather than streaming them.
- `VectorDataSource.fetchUnion` - fetches features from a SeaSketch VectorDatasource hosted at a url.
- `getFeatures` - fetches features for a variety of cloud-optimized vector formats with additional filter options, including Flatgeobuf and the SeaSketch VectorDataSource.

## Raster Data Fetching

The geoprocessing framework uses the geoblaze library, which offers a low-level `parse` function for reading metadata for a cloud-optimized GeoTIFF at a given URL. It will not fetch raster values directly, only subsequent calls to geoblaze calc methods with a geometry will fetch raster values within its bounding box.

The geoprocessing framework offers a convenience function that can be used instead, should the underlying methods change.

`loadCog` - re-export of geoblaze.parse

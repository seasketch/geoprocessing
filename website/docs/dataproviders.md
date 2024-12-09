# Data Providers

## Fetching Data

### Vector Data Fetching

The flatgeobuf library offers a low-level `deserialize` function for fetching features from a flatgeobuf file hosted at a url.

The geoprocessing framework offers some convenience functions that provide addtional functionality and access to more formats.

#### Flatgeobuf

- `getDatasourceFeatures` - fetches features for a given datasource, which can be published in a few different formats. cloud-optimized vector formats with additional filter options, including Flatgeobuf and the SeaSketch VectorDataSource.
- `getFeaturesForSketchBBoxes` - loads features from a FlatGeobuf referenced by URL, which intersect the bounding boxes of each individual sketch in a SketchCollection, or a single Sketch.
  - This is the best way to fetch features overlapping with a Sketch or Sketch Collection. Built-in antimeridian support.
- `loadFgb` - fetch vector features from flatgeobuf at url that intersect with a bounding box. Awaits all features before returning, rather than streaming them.

#### VectorDataSource

VectorDataSources are read by creating an instance of the `VectorDataSource` class. The polygons in one of these datasources have been subdivided to break them into smaller pieces and carefully indexed for fast retrieval of a subset given a bounding box using the `fetch` method. You can also rejion (union) the original features back together by using the `fetchUnion` method instead and passing the name of a feature property that uniquely identifies the original polygons.

```typescript
import { VectorDataSource } from "@seasketch/geoprocessing";

const osmLandUrl = "https://d3p1dsef9f0gjr.cloudfront.net";
const unionProperty = "gid";

const osmLandSource = new VectorDataSource(osmLandUrl);
if (unionProperty) {
  const fc = await osmLandSource.fetchUnion(bboxFilter, options.unionProperty);
  features = fc.features;
} else {
  features = await osmLandSource.fetch(bboxFilter);
}
```

- `VectorDataSource.fetchUnion` - fetches features from a SeaSketch VectorDatasource hosted at a url.

## Raster Data Fetching

The geoprocessing framework uses the geoblaze library, which offers a low-level `parse` function for reading metadata for a cloud-optimized GeoTIFF at a given URL. It will not fetch raster values directly, only subsequent calls to geoblaze calc methods with a geometry will fetch raster values within its bounding box.

The geoprocessing framework offers a convenience function that can be used instead, should the underlying methods change.

`loadCog` - re-export of geoblaze.parse

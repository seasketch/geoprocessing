# Data Providers

The geoprocessing framework offers multiple methods for reading vector and raster datasources.

## Vector Data Fetching

### Flatgeobuf Format

- `loadFgb` - simplest method for fetching features from a flatgeobuf file published at url, that intersect with given bounding box.
  - Awaits all features before returning, rather than streaming them.
  - Allows you to specify a narrower type for the features that will be returned.
  - No support for bounding boxes crossing the antimeridian.

```typescript
import { loadFgb } from "@seasketch/geoprocessing";
const url = "https://my.fgb";
const sketchBox = bbox(sketch);
const features = await loadFgb<Polygon | MultiPolygon>(url, sketchBox);
```

- `getFeaturesForBBoxes` - builds on loadFgb and accepts an array of bounding boxes to fetch features for. Built-in antimeridian support by splitting bounding boxes if they cross the antimeridian.

```typescript
import {
  getFeaturesForBBoxes,
  BBox,
  Polygon,
  MultiPolygon
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";

const url = "https://my.fgb";
const boxes: BBox[] = ...;
const reefFeatures: Feature<Polygon | MultiPolygon>[] = await getFeaturesForBBoxes(
  boxes,
  url,
  { uniqueIdProperty: 'gid' }
);
```

- `getFeaturesForSketchBBoxes` - builds on getFeaturesForBBoxes and accepts a Sketch or SketchCollection to fetch features for. If a collection, it will optimize and fetch the features that intersect with the bounding boxe of each individual sketch instead of overfetching for the bounding boxes of the whole collection. Built-in antimeridian support by splitting bounding boxes if they cross the antimeridian.

```typescript
import {
  getFeaturesForSketchBBoxes,
  BBox,
  Polygon,
  MultiPolygon,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";

const url = "https://my.fgb";
const reefFeatures: Feature<Polygon | MultiPolygon>[] =
  await getFeaturesForSketchBBoxes(sketch, url, { uniqueIdProperty: "gid" });
```

### VectorDataSource Format

VectorDataSource is a cloud-optimized format created by the SeaSketch team, before flatgeobuf was developed. There are multiple global datasets published that are still used by projects.

To read one of these datasources, create an instance of the `VectorDataSource` class. The polygons in one of these datasources have been subdivided to break them into smaller pieces and carefully indexed for fast retrieval of a subset given a bounding box using the `fetch` method. You can also rejion (union) the original features back together by using the `fetchUnion` method instead and passing the name of a feature property that uniquely identifies the original polygons.

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

### Datasource-aware Multi-format Fetching

Higher-level functions that take as input a project [Datasources](./concepts/Concepts.md#datasources) and can figure out where and how to fetch the features.

- `getDatasourceFeatures` - fetches features for a given vector datasource. Datasource can be published in one of two different cloud-optimized vector formats (Flatgeobuf or SeaSketch VectorDataSource). Offers extra `propertyFilter` allowing you to filter result set by property name having one or more caller-defined values.

```typescript
import { VectorDataSource } from "@seasketch/geoprocessing";

const osmLandSource = new VectorDataSource(
  "https://d3p1dsef9f0gjr.cloudfront.net",
);
const sketchBox = bbox(sketch);
const unionProperty = "gid";
const fc = await osmLandSource.fetchUnion(sketchBox, unionProperty);
const fcUnioned = await osmLandSource.fetch(sketchBox);
```

## Raster Data Fetching

The geoprocessing framework uses the geoblaze library for fetching raster metadata from a cloud-optimized GeoTIFF at a given URL. It does not export Typescripts types.

```typescript
import geoblaze from "geoblaze";

const raster = await geoblaze.parse(url);
const minResult = await geoblaze.min(minRaster, sketch);
const minTemp = minResult[0]; // extract value from band 1
```

The geoprocessing framework offers its own methods that use geoblaze under the hood.

`loadCog` - covenience function that can be used instead of geoblaze.parse

```typescript
import { loadCog } from "@seasketch/geoprocessing";

const minRaster = await loadCog(rasterUrl);
const statsByBand = await rasterStats(raster, {
  feature: sketch,
  stats: ["sum", "count", "min", "max", "mode", "invalid", "valid"],
});
```

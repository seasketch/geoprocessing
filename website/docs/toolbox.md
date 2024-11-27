# Toolbox

## Clipping Data

Turf functions can be used directly for clipping features including:

- `intersect`
- `difference`
- `union`

The geoprocessing toolbox offers some convenience functions that wrap these functions with additional functionality, error checking, and/or error prevention:

- `clip` - performs one of 4 different clip operations on features in one function (union, intersection, xor, difference)
- `clipMultiMerge` - performs clip after first merging features2 coords into a single multipolygon. Avoids errors in underlying clipping library when too many features in features2.
- `intersectInChunks` - calculates area overlap between a feature A and a feature array B. Intersection is done in chunks on featuresB to avoid errors due to too many features.
- `intersectInChunksArea` - calculates area overlap between a feature A and a feature array B. Intersection is done in chunks on featuresB to avoid errors due to too many features.
- `intersectSum` - sums a property value of intersecting features. No support for partial.
- [clipToPolygonFeatures](./api/geoprocessing/functions/clipToPolygonFeatures.md) - takes a Polygon feature and returns the portion remaining after performing one or more clipOperations (intersection or difference). If results in multiple polygons then returns the largest.
  `clipToPolygonDatasources`

## Vector Overlap Analysis

- `overlapFeatures` - calculates zonal statistics for overlap between sketch(es) and an array of polygon features.
  - high-level function that returns an array of Metric objects.
  - Supports area or sum operation (given sumProperty), defaults to area.
  - If sketch collection is input, calculates overall overlap stats as well as per child sketch.
  - handles overlap of sketch features so that overlap is not double counted in area/sum stats.

## Raster Overlap Analysis

Geoblaze can be used directly for calculating zonal raster statistics using a Sketch feature.

The geoprocessing framework offers some convenience functions that extend them with additional functionality:

High-level:

- [rasterMetrics](./api/geoprocessing/functions/rasterMetrics.md) calculate summary metrics (statistics/area) on a loa. If `sketch` is passed will limit to raster values overlapping with the sketch (zonal statistics). Similar to `rasterStats` but results are returned in a standardized `Metric` array format.
  - If `feature` is a collection, then calculate metrics for each individual feature as well as the collection as a whole. This can be disabled by passing `includeChildMetrics: false`. If your raster is a categorical raster you should pass `categorical: true` and optionally pass the list of `categoryMetricsValues` to pull out of the raster.
  - [Examples](https://github.com/search?q=org%3Aseasketch+rasterMetrics%28&type=code)
  - [Categorical example](https://github.com/seasketch/california-reports/blob/98cd29fc0da86707bfde9aa6f3ecf30c0e5db23a/src/functions/kelpMaxWorker.ts#L61)
- `overlapRasterClass` - salculates sum of overlap between sketches and a categorical raster with numeric values representing feature classes
- Lesser used:
  - `overlapRasterSum` - returns sum of cells overlapping sketch with raster as a metric object
  - `overlapRasterArea` - returns area of sketch overlap with raster as a metric object

Low-level:

- [rasterStats](./api/geoprocessing/functions/rasterStats.md) - is a lower-level all-in-one function for calculating up to 10 different raster stats in a single pass.
  - includes calculation of are not currently supported by geoblaze. Supported through use of equal area raster projection.
  - Optionally constrains to raster cells overlapping with feature.

Older function:

- [getSum](./api/geoprocessing/functions/getSum.md) - returns sum of raster cell values overlap with feature. (not multi-band aware, first band only)
- [getArea](./api/geoprocessing/functions/getArea.md) - returns area of valid raster cell values (not nodata) overlapping with feature. (not multi-band aware, first band only)

## Group Metrics

Calculate group-level metrics by assigning sketches to groups (e.g. group by protection level)

High-level:

- `overlapFeaturesGroupMetrics` - generate overlap metrics for groups of sketches using overlapFeatures operation.
- `overlapRasterGroupMetrics` - generate overlap metrics for groups of sketches using rasterMetrics operation
- `overlapAreaGroupMetrics` - generate overlap metrics for groups of sketches using overlapArea operation.

Low-level:

- `overlapArea` - calculates the area of each sketch and the proportion of outerArea they take up.
  - used by overlapAreaGroupMetrics.
- `overlapGroupMetrics` - given overlap metrics (vector or raster) stratified by class and sketch, returns new metrics also stratified by group. Assumes a sketch is member of only one group, determined by caller-provided metricToGroup.
  - used by all high-level group metrics functions

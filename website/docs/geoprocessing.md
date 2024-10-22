# Geoprocessing

Geoprocessing functions are often built around the concept of a Metric, but this is not required. It is a standardized way to represent a statistic or measurement with a single value and one or more dimensions relevant to SeaSketch planning (sketch, geography, class, group, etc.)

If these toolbox functions don't meet your needs, you can create your own.raster functions by using `geoblaze` library methods directly, or by copying and modifying a function like `getSum`, which knows how to generate and return an array of `Metric` objects, and adapt it to meet your needs.

## High Level Functions

### rasterMetrics

[rasterMetrics](./api/geoprocessing/functions/rasterMetrics.md) is an all-in-one function for calculating summary metrics (statistics/area) on a loaded raster. If `sketch` is passed will limit to raster values overlapping with the sketch (zonal statistics). Results are in standardized `Metric` array format.

If `feature` is a collection, then calculate metrics for each individual feature as well as the collection as a whole. This can be disabled by passing `includeChildMetrics: false`. If your raster is a categorical raster you should pass `categorical: true` and optionally pass the list of `categoryMetricsValues` to pull out of the raster.

- [Examples](https://github.com/search?q=org%3Aseasketch+rasterMetrics%28&type=code)
- [Categorical example](https://github.com/seasketch/california-reports/blob/98cd29fc0da86707bfde9aa6f3ecf30c0e5db23a/src/functions/kelpMaxWorker.ts#L61)

### overlapFeatures

`overlapFeatures`

`getFeatures`
`overlapFeaturesGroupMetrics`
`overlapRasterGroupMetrics`
`overlapRasterClass`
`overlapRasterSum`
`overlapRasterArea`

## Low Level Functions

These functions are used to build higher level functions. You can use them as a starting point to create your own custom functions.

### clipToPolygonFeatures

[clipToPolygonFeatures](./api/geoprocessing/functions/clipToPolygonFeatures.md) - takes a Polygon feature and returns the portion remaining after performing clipOperations (intersection or difference). If results in multiple polygons then returns the largest.

### rasterStats

- [rasterStats](./api/geoprocessing/functions/rasterStats.md) - calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.
- [getSum](./api/geoprocessing/functions/getSum.md) - returns sum of raster cell values overlap with feature. (not multi-band aware, first band only)
- [getArea](./api/geoprocessing/functions/getArea.md) - returns area of valid raster cell values (not nodata) overlapping with feature. (not multi-band aware, first band only)

/\*\*

- Calculates summary metrics (stats/area) on given raster, optionally intersecting raster with provided feature.
- If feature is a collection, then calculate metrics for each individual feature as well as the collection as a whole.
- This can be disabled with includeChildMetrics: false. Defaults to assuming a continuous raster but also supports categorical by option and
- categoryMetricValues option.
  \*/

## Util functions

splitSketchAntimeridian

clipToGeography

## Util classes

ProjectClient

## Objects

Datasource
MetricGroup

## Raster

loadCog

rasterMetrics

## Vector

fgbFetchAll

## Accuracy/Limitations

### Javascript-only

- The geoprocessing library currently only supports geoprocessing functiosn that run in a NodeJS environment. You have the ability to invoke any Lambda function, the framework just doesn't have first class support for writing and publishing functions in any other languages.

### Coordinate System Support

- Vector data, on import, is converted to WGS 84 (EPSG 4326). Vector toolbox functions expect data to be in this projection.
- Raster data, on import, is converted to an equal area projection (NSIDC EASE-Grid 2.0 Global)[https://epsg.io/6933]. Raster toolbox functions should work with any grid-based projection but anything other than equal area will have accuract issues.

- Geoprocessing functions in this library currently only support GeoJSON data in the World Geodetic System 1984 (WGS 84) [WGS84] datum (aka Lat/Lon), with longitude and latitude units of decimal degrees.

### Calculation Error

#### TurfJS

TurfJS vector function (particularly those that use [Turf.JS](http://turfjs.org/docs/#distance)) measure distance and area by approximating them on a sphere. Turf.js functions strike a balance between speed and accuracy.

- If the geographic area of your project is small, on the order of a few hundred to a thousand miles, and not at high latitudes (> 60), then the accuracy will be quite good, and the error quite small (within 5%) compared to more exact algorithms.
- And if your planning objectives target creating areas that capture a given % of something, for example 20% of the rocky reef habitat in the entire planning area, then the effect of error in area calculations should be limited to none as long as the area calculations are done using the same algorithms.

Sources:

- [Fast Geodesic Approximations](https://blog.mapbox.com/fast-geodesic-approximations-with-cheap-ruler-106f229ad016)
- [Calculate distance, bearing and more between Latitude/Longitude points](https://www.movable-type.co.uk/scripts/latlong.html)
- [Haversine Formula on Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula). Used by [turf-distance](https://github.com/Turfjs/turf/tree/master/packages/turf-distance). Error up to 0.5%
- [Some algorithms for polygons on a sphere](https://sgp1.digitaloceanspaces.com/proletarian-library/books/5cc63c78dc09ee09864293f66e2716e2.pdf) - used by [turf-area](http://turfjs.org/docs/#area). Greater error at higher latitudes vs. Vincenty.
- [Vincenty algorithm](https://en.wikipedia.org/wiki/Vincenty%27s_formulae) used by [turf-vincenty-inverse](https://github.com/Turfjs/turf-vincenty-inverse)
- [GeoJSON spec WGS84 requirement](https://datatracker.ietf.org/doc/html/rfc7946#section-4).

## Edge Cases

### Zero Geometries

In geoprocessing functions, sketches are clipped to the current geography using `clipToGeography()`. A georaphy can be as large as the extent of the entire world, or be a smaller boundary within the overall planning area.

When the geography is a subset of the larger planning area, you can have sketches that fall completely outside the geography, and the intersection of the sketch and the geography will have nothing remaining because there's no overlap. In GeoJSON, this clip result could be represented with a `null` geometry value, but Turf and most other libraries don't handle null geometries well, so `overlap` toolbox functions would have unexpected results.

We could also have clipToGeography return a `null` value for the entire sketch, but that gets complex, especially when you're processing a whole SketchCollection. What we decided to do instead is to have `clipToGeography` return a `zero` geometry when a sketch has no overlap with the geography. We do this using the `zeroSketch` helper function.Given a Sketch it replaces the geometry with a polygon at [[0,0], [0,0], [0,0], [0,0]]. It's a valid geometry, but's it's located at [Null Island](https://en.wikipedia.org/wiki/Null_Island). What happens as a result is that downstream `overlap` toolbox functions receive a Sketch as they expect, but when they pass it to any overlap functions it will return zero value metrics, as long as Null Island is not withing the planning area.

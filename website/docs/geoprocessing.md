# Geoprocessing

A geoprocessing function accepts a `sketch` parameter and one or more `extraParams`. extraParams are advanced runtime parameters that can be passed by a [report client](./tutorials/extraParams.md), or passed by a parent geoprocessing function to a [worker](./workers.md).

```typescript
export async function sdmValueOverlap(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<ReportResult> {
```

The first goal of a geoprocessing function might be to validate the sketch.

```typescript
import {
  isPolygonFeature,
  isPolygonSketchCollection,
} from "@seasketch/geoprocessing";

if (!isPolygonFeature(sketch) || isPolygonSketchCollection(sketch)) {
  throw new Error("Invalid sketch, expected Polygon or MultiPolygon");
}
```

A next step might be to extract extraParams and use [ProjectClient](./api/geoprocessing/classes/ProjectClientBase.md) helper methods to access project configuration such as geographies, datasources, etc.

```typescript
const mg = project.getMetricGroup("protectionCountOverlap");
const geographyId = getFirstFromParam("geographyIds", extraParams);
const curGeography = project.getGeographyById(geographyId, {
  fallbackGroup: "default-boundary",
});

const finalSketch = await clipToGeography(sketch, curGeography);
```

A next goal might be to extract custom attributes from the sketch and use that in analysis.

```typescript
const sketchFeatures = getSketchFeatures(sketch);

const protectionLevels = sketchFeatures.reduce<Record<string, number>>(
  (levels, sketch) => {
    console.log(sketch.properties);
    const designation = getUserAttribute(sketch.properties, "designation", "");
    if (!designation) throw new Error("Malformed sketch, no designation level");

    levels[designation] = 1 + (levels[designation] || 0);
    return levels;
  },
  {},
);
```

The key part of most geoprocessing functions is to take the parameters you've collected, load any datasources, usually using a MetricGroup, and run your analysis functions, to produce [Metrics](./concepts/AdvancedConcepts.md#metrics) and merge into a single result.

```typescript
const metrics: Metric[] = (
  await Promise.all(
    metricGroup.classes.map(async (curClass) => {
      if (!curClass.datasourceId)
        throw new Error(`Expected datasourceId for ${curClass}`);
      const url = `${project.dataBucketUrl()}${getCogFilename(
        project.getInternalRasterDatasourceById(curClass.datasourceId),
      )}`;
      const raster = await loadCog(url);

      const overlapResult = await rasterMetrics(raster, {
        metricId: metricGroup.metricId,
        feature: finalSketch,
      });
      return overlapResult.map(
        (metrics): Metric => ({
          ...metrics,
          classId: curClass.classId,
          geographyId: curGeography.geographyId,
        }),
      );
    }),
  )
).reduce(
  // merge
  (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
  [],
);
```

Then, you'll produce the final payload that the geoprocessing function will return.

```typescript
return {
  metrics: sortMetrics(rekeyMetrics(metrics)),
  sketch: toNullSketch(sketch),
};
```

Lastly, you'll pass your function to the GeoprocessingHandler function and export it for use.

```typescript
export default new GeoprocessingHandler(protection, {
  title: "protection",
  description: "returns area metrics for protection levels for sketch",
  timeout: 60, // seconds
  executionMode: "async",
  memory: 1024,
});
```

Some things to note:

- Typically, you will start with the default `memory` of 1024.
- Any function that is expected to take more than 3-5 seconds to run should be configured as `async` instead of `sync`, unless it's a worker function, which should always be `sync`.

## Toolbox Functions

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

If the high-level toolbox functions don't meet your needs, you can create your own, potentially creating from lower level functions.

### clipToPolygonFeatures

[clipToPolygonFeatures](./api/geoprocessing/functions/clipToPolygonFeatures.md) - takes a Polygon feature and returns the portion remaining after performing clipOperations (intersection or difference). If results in multiple polygons then returns the largest.

### rasterStats

- [rasterStats](./api/geoprocessing/functions/rasterStats.md) - calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.

- [getSum](./api/geoprocessing/functions/getSum.md) - returns sum of raster cell values overlap with feature. (not multi-band aware, first band only)
- [getArea](./api/geoprocessing/functions/getArea.md) - returns area of valid raster cell values (not nodata) overlapping with feature. (not multi-band aware, first band only)

## Raster

loadCog

rasterMetrics

## Vector

fgbFetchAll

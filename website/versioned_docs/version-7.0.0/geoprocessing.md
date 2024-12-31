# Geoprocessing

Geoprocessing functions are the analytical workhorse of SeaSketch reports. These functions are packaged and published as [AWS Lambda](https://aws.amazon.com/pm/lambda) functions which crunch numbers using spatial analysis libraries and organize the results into a payload to be returned to the caller.

Geoprocessing functions are typically invoked in one of two ways:

- By a ReportClient using a ResultsCard UI component.
- By another geoprocessing function such as a parent geoprocessing function calling a [worker](./workers.md) geoprocessing function.

The first step of a geoprocessing function is to import everything you need. The top-level `@seasketch/geoprocessing` module and the dataproviders submodule has most things. See the [Typescript API](./api/index.md) docs to discover more of what they offer.

```typescript
import {
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  Sketch,
  SketchCollection,
  DefaultExtraParams,
  toNullSketch,
  rekeyMetrics,
  sortMetrics,
  getCogFilename,
  MultiPolygon,
  getFirstFromParam,
  rasterMetrics,
  loadCog,
} from "@seasketch/geoprocessing";
import project from "../../project";
import { clipToGeography } from "../util/clipToGeography";
```

The geoprocessing function signature itself should accept a `Sketch` parameter and one or more [extraParams](./tutorials/extraParams.md) as input. [extraParams](./tutorials/extraParams.md) are extra runtime parameters that can be passed by a report client, or passed by a parent geoprocessing function to a [worker](./workers.md).

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

Another goal might be to extract custom attributes from the sketch and use that in analysis.

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

The key part of most geoprocessing functions is to take the parameters you've collected, use a pre-defined MetricGroup to retrieve and load datasources, then finally run the an analysis function to produce [Metrics](./concepts/Concepts.md#metrics), append additional IDs to those metrics (class, geography, etc.) so that it's explicitly clear what the value represents, and merge those metrics into a single result.

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

The final goal is to produce a payload to return to the caller. Sorting and rekeying metrics makes them more human readable.

```typescript
return {
  metrics: sortMetrics(rekeyMetrics(metrics)),
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

# Worker Functions

Worker functions are sync geoprocessing functions that are invoked directly by parent geoprocessing functions, allowing computationally intensive or memory intensive tasks to be split out across multiple lambdas. Worker results are assembled in the parent function and returned back to the report client

Anytime you are making calculations on multiple things (datasets, geographies, sketches), there is potential to split it out across worker functions.

- Multiple datasources
- Sketch collection with multiple sketches
- Multiple geographies

Here is an example of a parent geoprocessing function that invokes a worker for each geography:

```typescript
import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  DefaultExtraParams,
  runLambdaWorker,
  parseLambdaResponse,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import {
  GeoprocessingRequestModel,
  Metric,
  ReportResult,
  isMetricArray,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing/client-core";
import { kelpMaxWorker } from "./kelpMaxWorker.js";

export async function kelpMax(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>,
): Promise<ReportResult> {
  const metricGroup = project.getMetricGroup("kelpMax");
  const geographies = project.geographies;

  const metrics = (
    await Promise.all(
      geographies.map(async (geography) => {
        const parameters = {
          ...extraParams,
          geography: geography,
          metricGroup,
        };

        return process.env.NODE_ENV === "test"
          ? kelpMaxWorker(sketch, parameters)
          : runLambdaWorker(
              sketch,
              project.package.name,
              "kelpMaxWorker",
              project.geoprocessing.region,
              parameters,
              request!,
            );
      }),
    )
  ).reduce<Metric[]>(
    (metrics, result) =>
      metrics.concat(
        isMetricArray(result)
          ? result
          : (parseLambdaResponse(result) as Metric[]),
      ),
    [],
  );

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
  };
}

export default new GeoprocessingHandler(kelpMax, {
  title: "kelpMax",
  description: "kelpMax overlap",
  timeout: 500, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  workers: ["kelpMaxWorker"],
});
```

Some things to notice:

- The kelpMax function is configured as `async`. Any geoprocessing function invoking workers will likely take long enough to run that it should just be async.
- A `workers` option is defined that registers a worker named `kelpMaxWorker`. It is required on publish that there be another sync geoprocessing function with the title `kelpMaxWorker`.
- kelpMax is set to use relatively low memory, because all the work is being done by the workers.
- The worker function is invoked using the [runLambdaWorker](./api/geoprocessing/functions/runLambdaWorker.md) utility function. This function invokes the lambda with the given name.
- kelpMaxWorker is being called once for each `geography` and also the set of `metricGroups`.
- In the case of it being a test environment, then `kelpMaxWorker` is run directly. This means that in a test environment all of the worker functions run on the same thread, which could overwhelm your system. Keep sketch examples as simple as possible for smoke tests.

Here is an example of the worker function:

```typescript
export async function kelpMaxWorker(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: {
    geography: Geography;
    metricGroup: MetricGroup;
  },
) {
  const geography = extraParams.geography;
  const metricGroup = extraParams.metricGroup;

  if (!metricGroup.datasourceId)
    throw new Error(`Expected datasourceId for ${metricGroup.metricId}`);

  // Support sketches crossing antimeridian
  const splitSketch = splitSketchAntimeridian(sketch);

  // Clip sketch to geography
  const clippedSketch = await clipToGeography(splitSketch, geography);

  // Get bounding box of sketch remainder
  const sketchBox = clippedSketch.bbox || bbox(clippedSketch);

  const ds = project.getDatasourceById(metricGroup.datasourceId);
  if (!isRasterDatasource(ds))
    throw new Error(`Expected raster datasource for ${ds.datasourceId}`);

  const url = project.getDatasourceUrl(ds);

  // Start raster load and move on in loop while awaiting finish
  const raster = await loadCog(url);

  // Start analysis when raster load finishes
  const overlapResult = await rasterMetrics(raster, {
    metricId: metricGroup.metricId,
    feature: clippedSketch,
    ...(ds.measurementType === "quantitative" && { stats: ["area"] }),
    ...(ds.measurementType === "categorical" && {
      categorical: true,
      categoryMetricValues: metricGroup.classes.map((c) => c.classId),
    }),
  });

  return overlapResult.map(
    (metrics): Metric => ({
      ...metrics,
      classId: "kelpMax",
      geographyId: geography.geographyId,
    }),
  );
}

export default new GeoprocessingHandler(kelpMaxWorker, {
  title: "kelpMaxWorker",
  description: "",
  timeout: 500, // seconds
  memory: 1024, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
```

Some things to notice:

- The worker function receives the `extraParams` passed by the parent geoprocessing function. This is no different than how a geoprocessing function receives `extraParams` passed by a report client.

Other things to know:

- Caching of results in DynamoDB is disabled for workers. The thinking is that if the parent geoprocessing function results are cached, then the worker caches will never be accessed, at least not under current use cases, so they don't be created. This drastically reduces the number of DynamoDB items created for each report, keeping costs down.

For more examples see [california-reports](https://github.com/seasketch/california-reports/tree/main/src/functions)

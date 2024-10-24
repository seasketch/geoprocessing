# Creating a geoprocessing function

The `create:report` function builds both a geoprocessing function and component based on a metric group. If you instead wish to strictly create a function, you can use:

```bash
npm run create:function
```

Enter some information about this function:

```
? Function type Geoprocessing - For sketch reports
? Title for this function, in camelCase simpleFunction
? Describe what this function does Calculates area overlap with coral cover dataset
? Choose an execution mode Async - Better for long-running processes
```

The command should then return the following output:

```
✔ created simpleFunction function in src/functions/

Geoprocessing function initialized

Next Steps:
  * Update your function definition in src/functions/simpleFunction.ts
  * Smoke test in simpleFunctionSmoke.test.ts will be run the next time you execute 'npm test'
  * Populate examples/sketches folder with sketches for smoke test to run against
```

The function will have been added to `project/geoprocessing.json` in the `geoprocessingFunctions` section.

The geoprocessing function file starts off with boilerplate code every geoprocessing function should have. It then includes an example of loading both vector data and raster data from [global datasources](https://github.com/seasketch/global-datasources) and calculating some simple stats, and returning a `Result` payload. To explain in more detail:

First a Typescript interface is defined that defines the shape of the data that the geoprocessing function will return. This defines an `object` with properties `area` and `nearbyEcoregions`, `minTemp`, and `maxTemp`.

```typescript
export interface SimpleResults {
  /** area of sketch within geography in square meters */
  area: number;
  /** list of ecoregions within bounding box of sketch  */
  nearbyEcoregions: string[];
  /** minimum surface temperature within sketch */
  minTemp: number;
  /** maximum surface temperature within sketch */
  maxTemp: number;
}
```

Then comes the actual geoprocessing function, which accepts a `sketch` as its first parameters. It can be either a single Sketch Polygon/Multipolygon, or a SketchCollection containing Polygons/MultiPolygons. The second parameter is `extraParams`, which is an object that may contain [one or more identifiers] passed by the report client when invoking the geoprocessing function (https://seasketch.github.io/geoprocessing/api/interfaces/geoprocessing.DefaultExtraParams.html)

```typescript
async function yourFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<AreaResults> {
```

First, the function will get any `geographyIds` that may have been passed by the report client via `extraParams` to specify which geography to run the function for. It will then use `getGeographyById` to get the geography object with that id from `geographies.json`. If the `geographyId` is undefined, then it will return the default geography.

```typescript
// Use caller-provided geographyId if provided
const geographyId = getFirstFromParam("geographyIds", extraParams);
// Get geography features, falling back to geography assigned to default-boundary group
const curGeography = project.getGeographyById(geographyId, {
  fallbackGroup: "default-boundary",
});
```

Next, the function will handle the situation where the `sketch` crosses the 180 degree antimeridian (essentially the dateline) by calling `splitSketchAntimeridian`. If the sketch crosses the antimeridian, it will clean (adjust) the coordinates to all be within -180 to 180 degrees. Then it will split the sketch into two pieces, one on the left side of the antimeridan, one on the right side. This splitting is required by many spatial libraries to perform operations on the sketch. Vector datasources are also split on import for this reason.

```typescript
// Support sketches crossing antimeridian
const splitSketch = splitSketchAntimeridian(sketch);
```

After that, the sketch is clipped to the current geography, so that only the portion of the sketch that is within the geography remains.

```typescript
// Clip to portion of sketch within current geography
const clippedSketch = await clipToGeography(splitSketch, curGeography);
```

Now we get to the core of what this particularly geoprocessing function is designed to do. Think of this as a starting point that you can adapt to meet your needs.

First, we'll fetch the [Marine Ecoregions of the World](https://github.com/seasketch/global-datasources?tab=readme-ov-file#marine-ecoregions-of-the-world) polygon features that overlap with the bounding box of the `clippedSketch`. Then reduce this down to an array of ecoregion names. You could take this further to reduce down to only the ecoregions that intersect with the sketch.

```typescript
// Fetch eez features overlapping sketch bbox
const ds = project.getExternalVectorDatasourceById("meow-ecos");
const url = project.getDatasourceUrl(ds);
const eezFeatures = await getFeatures(ds, url, {
  bbox: clippedSketch.bbox || bbox(clippedSketch),
});

// Reduce to list of ecoregion names
const regionNames = eezFeatures.reduce<Record<string, string>>(
  (regionsSoFar, curFeat) => {
    if (curFeat.properties && ds.idProperty) {
      const regionName = curFeat.properties[ds.idProperty];
      return { ...regionsSoFar, [regionName]: regionName };
    } else {
      return { ...regionsSoFar, unknown: "unknown" };
    }
  },
  {},
);
```

Next, we'll fetch all the [minimum](https://github.com/seasketch/global-datasources?tab=readme-ov-file#biooracle-present-day-surface-temperature-maximum) and [maximum](https://github.com/seasketch/global-datasources?tab=readme-ov-file#biooracle-present-day-surface-temperature-maximum) surface temperature measurements within the `clippedSketch` and then calculate the single minimum and maximum values.

```typescript
const minDs = project.getRasterDatasourceById("bo-present-surface-temp-min");
const minUrl = project.getDatasourceUrl(minDs);
const minRaster = await loadCog(minUrl);
const minResult = await geoblaze.min(minRaster, clippedSketch);
const minTemp = minResult[0]; // extract value from band 1

const maxDs = project.getRasterDatasourceById("bo-present-surface-temp-max");
const maxUrl = project.getDatasourceUrl(maxDs);
const maxRaster = await loadCog(maxUrl);
const maxResult = await geoblaze.max(maxRaster, clippedSketch);
const maxTemp = maxResult[0]; // extract value from band 1
```

The final step of the function is always to return the result payload back to the report client

```typescript
return {
  area: turfArea(clippedSketch),
  nearbyEcoregions: Object.keys(regionNames),
  minTemp,
  maxTemp,
};
```

At the bottom of the file, the geoprocessing function is wrapped into a `GeoprocessingHandler` which is what gets exported by the file. This handler provides what the geoprocessing function needs to run in an AWS Lambda environemnt, specifically to be called via REST API by a report client, receive input parameters and send back function results. It also lets you fine tune the hardware characteristics of the Lambda to meet performance requirements at the lowest cost. Specifically, you can increase the memory available to the Lambda up to `10240` KB, which will also increase the cpu size and number. You can also increase the timeout up `900` seconds or 15 minutes for long running analysis, though `180` - `300` seconds is probably the longest amount a user is willing to wait. You will want to use an `async` function over `sync` if the function runs for more than say 5 seconds with a typical payload. The `title` and `description` fields are published in the projects service manifest to list what functions are available.

```typescript
export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Function description",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
```

To publish your new function:

- Add it to the `project/geoprocessing.json` file under the `geoprocessingFunctions` section.
- Build and publish your project as normal.

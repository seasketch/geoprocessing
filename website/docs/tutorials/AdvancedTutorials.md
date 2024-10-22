# Advanced Tutorials

## Creating a geoprocessing function

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

### Creating a Report Client

To create a new report client simply run:

```bash
npm run create:client
```

Enter some information about this report client:

```
? Name for this client, in PascalCase ReefReport
? Describe what this client is for calculating reef overlap
? What is the name of geoprocessing function this client will invoke? (in camelCase) reefAreaOverlap
```

The command should then return the following output:

```
✔ created ReefReport client in src/clients/

Geoprocessing client initialized

Next Steps:
    * Update your client definition in src/clients/ReefReport.tsx
    * View your report client using 'npm storybook' with smoke test output for all geoprocessing functions
```

Assuming you named your client the default `SimpleReport`, it will have been been added to `project/geoprocessing.json` in the `clients` section. A `SimpleReport.tsx` file will have been added to `src/clients` folder. It is responsible for rendering your new `SimpleCard` component from the `src/components` folder and wrapping it in a language `Translator`. Think of the Card component as one section of a report. It executes a geoprocessing function and renders the results in a way that is readable to the user. You can add one or more Cards to your Report client. If your report gets too long, you can split it into multiple ReportPages. See the [TabReport](https://github.com/seasketch/geoprocessing/blob/dev/packages/template-blank-project/src/clients/TabReport.tsx) example of how to add a `SegmentControl` with multiple pages.

`SimpleReport.stories.tsx` and `SimpleCard.stories.tsx` files will both be included that allows you to view your Report and Card components in [storybook](#storybook) to dial in how they should render for every example sketch and their smoke test output.

After adding a report client, be sure to properly setup user displayed text for [translation](../gip/GIP-1-i18n.md#making-report-strings-translatable). You'll need to follow the full workflow to extract the english translation and add the translations for other languages.

## Updating A Datasource

When updating a datasource, you should try to take it all the way through the process of `import`, `precalc`, and `publish` so that there's no confusion about which step you are on. It's easy to leave things in an incomplete state and its not obvious when you pick it back up.

- Edit/update your data in data/src
- Run `npm run reimport:data`, choose your source datasource and choose to not publish right away. `data/dist` will now contain your updated datasource file(s).
- Run `npm run precalc:data`, choose the datasource to precalculate stats for.
- `npm test` to run your smoke tests which read data from `data/dist` and make sure the geoprocessing function results change as you would expect based on the data changes. Are you expecting result values to go up or down? Stay about or exactly the same? Try not to accept changes that you don't understand.
- Add additional sketches or features to your smoke tests as needed. Exporting sketches from SeaSketch as geojson and copying to `examples/sketches` is a great way to do this. Convince yourself the results are correct.
- Publish your updated datasets with `npm run publish:data`.
- Clear the cache for all reports that use this datasource with `npm run clear:results` and type the name of your geoprocessing function (e.g. `boundaryAreaOverlap`) or simply `all`. Cached results are cleared one record at a time in dynamodb so this can take quite a while. In fact, the process can run out of memory and suddenly die. In this case, you can simply rerun the clear command and it will continue. Eventually you will get through them all.
- Test your reports in SeaSketch. Any sketches you exported should produce the same numbers. Test with any really big sketches, make sure your data updates haven't reached any new limit. This can happen if your updated data is much larger, has more features, higher resolution, etc.

## Custom Sketch Attributes

Sketch attributes are additional properties provided with a Sketch Feature or a Sketch Collection. They can be user-defined at draw time or by the SeaSketch platform itself. The SeaSketch admin tool lets you add custom attributes to your [sketch classes](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes). SeaSketch will pass these sketch attributes on to both preprocessing and geoprocessing functions.

Common use cases:

- Preprocessor
  - Passing an extra yes/no attribute for whether to include existing protected areas as part of your sketch, or whether to allow the sketch to extend beyond the EEZ, or to include land.
  - Passing a numeric value to be used with a buffer.
- Geoprocessor
  - Provide language translations for each sketch attribute name and description, for each language enabled for the project.
  - Assign a protection level or type to an area, such that the function (and resulting report) can assess against the required amount of protection for each level.
  - Assign activities to an area, that the function can assign a protection level. This is particularly useful when reporting on an entire SketchCollection. The function can group results by protection level and ensure that overlap is not double counted within each group, but allow overlap between groups to go to the higher protection level.

### Accessing sketch properties from report client

The main way to access sketch attributes from a browser client is the [useSketchProperties()](https://seasketch.github.io/geoprocessing/api/modules/client_ui.html#useSketchProperties) hook. Examples include:

- [SketchAttributesCard](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesCard.tsx) and [story](https://seasketch.github.io/geoprocessing/storybook/?path=/story/components-card-sketchattributescard--next) with [source](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesNextCard.stories.tsx)

### Accessing sketch properties from function

Withing a preprocessing or geoprocessing function, the [SketchProperties](https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#SketchProperties) are provided within every sketch. Within that are [userAttributes](https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#UserAttribute) that contain all of the user-defined attributes.

For example, assume your Polygon sketch class contains an attribute called `ACTIVITIES` which is an array of allowed activities for this sketch class. And you have a second attribute called `ISLAND` that is a string containing the name of the island this sketch is located. You can access it as follow:

```javascript
export async function protection(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const sketches = toSketchArray(sketch);
  // Complex attributes are JSON that need to be parsed
  const activities = getJsonUserAttribute(sketches[0], 'ACTIVITIES')
  // Simple attributes are simple strings or numbers that can be used directly
  const island = getUserAttribute(sketches[0], 'ISLAND')
```

Examples of working with user attributes:

- [getIucnCategoryForSketches](https://github.com/seasketch/geoprocessing/blob/1301dc787aeff59ed29ceb07ed2d925984da6abf/packages/geoprocessing/src/iucn/helpers.ts#L36) takes an array of sketches, extracts the list of IUCN `ACTIVITIES` the sketch designated as allowed for each sketch, and returns the category (protection level) for each sketch. The sketch array can be generated from the `sketch` parameter passed to a geoprocessing functions using [toSketchArray()`](https://github.com/seasketch/geoprocessing/blob/1301dc787aeff59ed29ceb07ed2d925984da6abf/packages/geoprocessing/src/helpers/sketch.ts#L83). toSketchArray helps you write single functions that work on either a single sketch or a collection of sketches.
- [isContiguous](https://github.com/seasketch/fsm-reports/blob/main/src/functions/boundaryAreaOverlap.ts#L26) function that optionally merges the contiguous zone with the users sketch. Checks for existence of a [specific user attribute](https://github.com/seasketch/fsm-reports/blob/main/src/util/includeContiguousSketch.ts#L28)

## Adding and Passing Extra Parameters

Sometimes you want to pass additional parameters to a preprocessing or geoprocessing function that are defined outside of the sketch creation process by seasketch or through the report itself. These `extraParams` are separate from the `sketch`. They are an additional object passed to every preprocessing and geoprocessing function.

Use Cases:

- Preprocessor
  - Passing one or more `eezs` to a global clipping function that specifies optional EEZ boundaries to clip the sketch to in addition to removing land.
- Geoprocessor
  - Subregional planning. Passing one or more `geographyIds`, as subregions within an EEZ. This can be used to when calculating results for all subregions at once doesn't make sense, or is computationally prohibitive. Instead you may want the user to be able to switch between subregions, and the reports will rerun the geoprocessing function with a different geography and update with the result on-demand.

### Passing Extra Parameters To Geoprocessing Functions

Report developers will pass the extra parameters to a geoprocessing function via the ResultsCard. It must be an object where the keys can be any JSON-compatible value. Even nested objects and arrays are allowed.

```jsx
<ResultsCard
  title={t("Size")}
  functionName="boundaryAreaOverlap"
  extraParams={{ geographyIds: ["nearshore", "offshore"] }}
  useChildCard
>
```

A common next step for this is to maintain the array of geographyIds in the parent Card, and potentially allow the user to change the values using a UI selector. If the value passed to `extraParams` changes, the card will re-render itself, triggering the run of a new function, and displaying the results.

Internally the [ResultsCard](https://github.com/seasketch/geoprocessing/blob/7275bd3ddf355259cf99335a761b99472045b6f8/packages/geoprocessing/src/components/ResultsCard.tsx) uses the [useFunction](https://github.com/seasketch/geoprocessing/blob/7275bd3/packages/geoprocessing/src/hooks/useFunction.ts#L44) hook, which accepts `extraParams`.

```typescript
useFunction('boundaryAreaOverlap', { geographyIds: ['santa-maria'] }
```

If invoking functions directly, such as SeaSketch invoking a preprocessing function, the `extraParams` can be provided in the event body.

```json
{
  "feature": {...},
  "extraParams": { "eezs": ["Azores"], "foos": "blorts", "nested": { "a": 3, "b": 4 }}
}
```

### Accessing Extra Parameters In Functions

Both preprocessing and geoprocessing functions receive a second `extraParams` parameter. The default type is `Record<string, JSONValue>` but the implementer can provide a narrower type that defines explicit parameters.

Geoprocessing function:

```typescript
/** Optional caller-provided parameters */
interface ExtraParams {
  /** Optional ID(s) of geographies to operate on. **/
  geographyIds?: string[];
}

export async function boundaryAreaOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  extraParams: ExtraParams = {}
): Promise<ReportResult> {
  const geographyIds = extraParams.geographyIds
  console.log('Current geographies', geographyIds)
  const results = runAnalysis(geographyIds)
  return results
```

Preprocessing function:

```typescript
interface ExtraParams {
  /** Array of EEZ ID's to clip to  */
  eezs?: string[];
}

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land) and within one or more EEZ boundaries.
 */
export async function clipToOceanEez(
  feature: Feature | Sketch,
  extraParams: ExtraParams = {},
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  /**
   * Subtract parts of feature/sketch that overlap with land. Uses global land polygons
   * unionProperty is specific to subdivided datasets.  When defined, it will fetch
   * and rebuild all subdivided land features overlapping with the feature/sketch
   * with the same gid property (assigned one per country) into one feature before clipping.
   * This is useful for preventing slivers from forming and possible for performance.
   */
  const removeLand: DatasourceClipOperation = {
    datasourceId: "global-clipping-osm-land",
    operation: "difference",
    options: {
      unionProperty: "gid", // gid is assigned per country
    },
  };

  /**
   * Optionally, subtract parts of feature/sketch that are outside of one or
   * more EEZ's.  Using a runtime-provided list of EEZ's via extraParams.
   * eezFilterByNames allows this preprocessor to work for any set of EEZ's
   * Using a project-configured planningAreaId allows this preprocessor to work
   * for a specific EEZ.
   */
  const removeOutsideEez: DatasourceClipOperation = {
    datasourceId: "global-clipping-eez-land-union",
    operation: "intersection",
    options: {
      propertyFilter: {
        property: "UNION",
        values: extraParams?.eezs || [project.basic.planningAreaId] || [],
      },
    },
  };

  // Create a function that will perform the clip operations in order
  const clipLoader = genClipLoader(project, [removeLand, removeOutsideEez]);

  // Wrap clip function into preprocessing function with additional clip options
  return clipToPolygonFeatures(feature, clipLoader, {
    maxSize: 500000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false, // throws error if feature is larger than maxSize
    ensurePolygon: true, // don't allow multipolygon result, returns largest if multiple
  });
}
```

### Writing stories with extraParams

Default smoke tests typically don't pass extraParams to the preprocessing or geoprocessing function but they can. Just know that each smoke test can only output results for one configuration of extraParams. And storybook can only load results for one smoke test run.
This means that in order to test multiple variations of extraParams, you will need to create multiple smoke tests. You could even write multiple smoke tests that each write out results all in one file.

Example smoke test (e.g. boundaryAreaOverlapExtraParamSmoke.test.ts):

```typescript
test("boundaryAreaOverlapSantaMariaSmoke - tests run with one subregion", async () => {
  const examples = await getExamplePolygonSketchAll();
  for (const example of examples) {
    const result = await boundaryAreaOverlap(example, { geographyIds: ['santa-maria']});
    expect(result).toBeTruthy();
    writeResultOutput(result, "boundaryAreaOverlapSantaMaria", example.properties.name);
  }
}
```

## Subdividing Large Datasets

If you have very large polygon datasets (think country or global data) with very large complex polygon, the standard data import process which uses flatgeobuf, may not be sufficient. An alternative is to use a `VectorDataSource` specially created by SeaSketch. It's based on a method described by Paul Ramsey in [this article](https://blog.cleverelephant.ca/2019/11/subdivide.html) of [subdividing](https://postgis.net/docs/ST_Subdivide.html) your data, cutting it up along the boundaries of a spatial index.

Once the polygons have been subdivided, they can be put into small files encoded in the geobuf format, and a lookup table created for the index. This entire bundle can be then put into S3 cloud storage.

![subdivision process](https://user-images.githubusercontent.com/511063/79161015-a0375e80-7d8f-11ea-87a9-0658777f2f90.jpg)

The magic comes in being able to request polygons from this bundle in our geoprocessing functions. A `VectorDataSource` class is available that lets us request only the polygon chunks from our subdivided bundle that overlap with the bounding box of our sketch that we are currently analyzing. It even caches request results locally so that subsequent requests do not call out to the network if needed.

`VectorDataSource` can also rebuild the polygon chunks back into the original polygons they came from. Imagine you've subdivide a dataset of country boundary polygons for the entire world. You've subdivided them, and now you can reconstruct them back into country polygons. You simply need to maintain an attribute with your polygons that uniquely identifies how they should be reconstructed. This could be a `countryCode` or just a non-specific `gid`.

Here is an example of use end-to-end. Note this is quite a manual process. Future framework versions may try to automate it.

- [data prep script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-prep.sh).
- [sql subdivide script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union.sql) run by the data prep script
- [publish script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-publish.sh) brings the subdivided polygons out of postgis, encodes them in geobuf format, builds the index, and publishes it all to a standalone S3 bucket that is independent of your project. The url of the S3 bucket will be provided once complete. You can ``--dry-run` the command to see how many bundles it will create and how big they'll be. The sweet spot is bundles about ~25KB in size. Once you've found that sweet spot you can do the actual run.
- [use of VectorDataSource in gp function](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/src/functions/clipToOceanEez.ts#L32)

This is the method that is used for the global `land` and `eez` datasources. Here is a full example of subdividing OpenStreetMap land polygons for the entire world. This is what is used for the `clipToOceanEez` script that comes with the `ocean-eez` starter template.

- [publish vector data source](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-publish.sh)

## Advanced storybook usage

There are multiple ways to introduce state into your stories. Many components draw their state from the ReportContext, which contains a lot of the information passed to the app on startup from seasketch.

There are 3 common methods for creating a story with context. All of these methods are built on `ReportStoryLayout`.

ReportStoryLayout is a component used by storybook that wraps your story in the things that the top-level App component would provide including setting report context, changing language, changing text direction, as well as offering dropdown menus for changing the language and the report width for different device sizes.

1. ReportDecorator - decorator that wraps story in ReportStoryLayout and otherwise uses default context value. A good starting point because it's simple. (see Card.stories.tsx). Language translation will work in the story with this method.
2. If you want to override the context in your stories use `createReportDecorator()` - decorator generator that wraps story in ReportStoryLayout and lets you override report context. Because a decorator can only be specified for the whole file, you should only use this if you want all stories in the file to be overidden with the same context. (see SegmentControl.stories.tsx). But you can split them up into multiple story files. Language translation will work in the story with this method.
3. For optimal control can use the ReportCardDecorator in combindation with `sampleSketchReportContextValue()` to set the context per story (see LayerToggle.stories.tsx). Language translation will not work with the story in this method.

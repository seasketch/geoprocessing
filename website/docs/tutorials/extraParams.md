# Adding and Passing Extra Parameters

Sometimes you want to pass additional parameters to a preprocessing or geoprocessing function that are defined outside of the sketch creation process by seasketch or through the report itself. These `extraParams` are separate from the `sketch`. They are an additional object passed to every preprocessing and geoprocessing function.

Extra parameters should be JSON serializable. Strings, numbers, objects, etc. but no functions.

Use Cases:

- Preprocessor
  - Passing one or more `eezs` to a global clipping function that specifies optional EEZ boundaries to clip the sketch to in addition to removing land.
- Geoprocessor
  - Subregional planning. Passing one or more `geographyIds`, as subregions within an EEZ. This can be used to when calculating results for all subregions at once doesn't make sense, or is computationally prohibitive. Instead you may want the user to be able to switch between subregions, and the reports will rerun the geoprocessing function with a different geography and update with the result on-demand.

## Passing Extra Parameters To Geoprocessing Functions

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

## Accessing Extra Parameters In Functions

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

  // Wrap clip function into preprocessing function with additional clip options
  return clipToPolygonFeatures(feature, clipLoader, {
    maxSize: 500000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false, // throws error if feature is larger than maxSize
    ensurePolygon: true, // don't allow multipolygon result, returns largest if multiple
  });
}
```

## Writing smoke tests with extraParams

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

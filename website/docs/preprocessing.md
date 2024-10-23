# Preprocessing

Preprocessing functions are sketch validators. These functions are packaged and published as AWS Lambda functions, which are then invoked by the SeaSketch platform right after a user finishes drawing a shape, which is different from [geoprocessing](./geoprocessing.md) functions. The other thing that makes them different from geoprocessing functions is that they receive as input a [Feature](https://datatracker.ietf.org/doc/html/rfc7946#section-3.2) Polygon instead of a Sketch, so no user-provided sketch attributes. A preprocessors purpose is validation and modification of the underlying polygon geometry, which often includes:

- Check geometry is a valid polygon, no self-crossing.
- Check geometry is within the planning area boundary, and remove any portion that is outside of it.
- Check geometry meets minimum size or is below maximum size

There are two approaches to creating a preprocessing function: using `genPreprocessor` and writing a custom preprocessor.

## genPreprocessor

genPreprocessor offers a quick method for creating a preprocessing function when you just need to perform one or more clip operations on your sketch (intersection or difference) using published datasources. Offers useful checks that can be enabled such as `ensurePolygon`, `minSize`, `maxSize`, `enforceMinSize` and `enforceMaxSize`.

The first thing you do is call the [genClipLoader](./api/dataproviders/functions/genClipLoader.md) function with the parameters of the clip operations you need, then pass the result to [genPreprocessor](./api/geoprocessing/functions/genPreprocessor.md) to create a preprocessing function.

Here's an example that clips a sketch to a nearshore 6 nautical mile boundary

```typescript
import {
  PreprocessingHandler,
  genPreprocessor,
} from "@seasketch/geoprocessing";
import project from "../../project";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";

const clipLoader = genClipLoader(project, [
  {
    datasourceId: "6nm_boundary",
    operation: "intersection",
    options: {},
  },
]);

export const clipToOceanEez = genPreprocessor(clipLoader);

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
```

More examples include:

- [clipToOceanEez](https://github.com/seasketch/geoprocessing/blob/dev/packages/template-ocean-eez/src/functions/clipToOceanEez.ts)
- [clipToLand](https://github.com/seasketch/geoprocessing/blob/dev/packages/template-ocean-eez/src/functions/clipToLand.ts)

## Custom Preprocessor

Examples of a custom preprocessing function

```typescript
/**
 * Takes a Polygon feature and returns the portion that is in the ocean and within an EEZ boundary
 * If results in multiple polygons then returns the largest
 */
export async function clipToOceanEez(
  feature: Feature,
  eezFilterByNames?: string[],
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  let clipped = await clipLand(feature);
  if (clipped) clipped = await clipOutsideEez(clipped, eezFilterByNames);

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Sketch is outside of project boundaries");
  } else {
    if (clipped.geometry.type === "MultiPolygon") {
      const flattened = flatten(clipped);
      let biggest = [0, 0];
      for (var i = 0; i < flattened.features.length; i++) {
        const a = area(flattened.features[i]);
        if (a > biggest[0]) {
          biggest = [a, i];
        }
      }
      return flattened.features[biggest[1]] as Feature<Polygon>;
    } else {
      return clipped;
    }
  }
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description:
    "Erases portion of sketch overlapping with land or extending into ocean outsize EEZ boundary",
  timeout: 40,
  requiresProperties: [],
});
```

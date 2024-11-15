# Preprocessing

Preprocessing function are invoked by the SeaSketch platform, on a user-drawn shape, right after the user finishes drawing it. It's a specialized function that validates a drawn shape and potentially modifies it, such as to remove portions of the shape outside the planning boundary. This "clipping" of the shape allows a user to overdraw beyond the boundary and it will be clipped right to the edge of the boundary.

In the `src/functions` directory you will find four preprocessing functions that come with every project, and they are further configureable to meet your needs:
`validatePolygon` - verifies shape is not self-crossing, is at least 500 square meters in size, and no larger than 1 million square kilometers.
`clipToLand` - clips the shape to just the portion on land, as defined by OpenStreeMap land polygons. Includes validatePolygon.
`clipToOcean` - clips the shape to remove the portion on land, as defined by OpenStreetMap land polygons. Includes validatePolygon.
`clipToOceanEez` - clips the shape to keep the portion within the boundary from the coastline to the outer boundary of the EEZ. Includes validatePolygon.

These preprocessing functions are already registered in the projects `geoprocessing.json` file to be deployeod as [AWS Lambda](https://aws.amazon.com/pm/lambda) functions. You can then select one of these preprocessors for your sketch class in your SeaSketch project and it will be called automatically right after a user finishes drawing a shape. If the preprocessing function throws with an error message, it will be presented to the user and they will be allowed to edit their shape and resubmit.

## Testing

## Creating

There are three approaches to creating a preprocessing function, from hight level to low level:

- clipToPolygonDatasources
- clipToPolygonFeatures
- custom function

Let's compare them.

## clipToPolygonDatasources

This function is useful if you already manage one or more polygon `Datasources` in your project. It will perform one or more clip operations on the input `feature`. For each clip, you specify the operation type (intersection or difference) and the datasource. It will fetch the using the . The operations are applied in the order received and can be an `intersection` or `difference`.

clip operations on to performs on the user sketch an array of clip operations to

If you use the `datasources` feature of the framework, then this option allows you to data used in your preprocessing functions are registered as datasources in your project, then this is the simplest approach.

```typescript
export async function clipToLand(
  feature: Feature | Sketch,
  extraParams: DefaultExtraParams = {},
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const keepLand: DatasourceClipOperation = {
    datasourceId: "global-clipping-osm-land",
    operation: "intersection",
    options: {
      unionProperty: "gid", // gid is assigned per country
      propertyFilter: {
        property: "gid",
        values: extraParams?.countryIds || [project.basic.planningAreaId] || [],
      },
    },
  };

  return clipToPolygonDatasources(project, feature, [keepLand], {
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
    ensurePolygon: true,
  });
}
```

## clipToPolygonFeatures

If you

```typescript
export async function clipToLand(feature: Feature | Sketch): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  const featureBox = bbox(feature);

  const landDatasource = new VectorDataSource(
    "https://d3p1dsef9f0gjr.cloudfront.net/",
  );
  const landFC = await landDatasource.fetchUnion(featureBox, "gid");

  const keepLand: FeatureClipOperation = {
    operation: "intersection",
    clipFeatures: landFC.features,
  };

  return clipToPolygonFeatures(feature, [keepLand], {
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
    ensurePolygon: true,
  });
}
```

## Custom Preprocessor

genPreprocessor offers a quick method for creating a preprocessing function when you just need to perform one or more clip operations on your sketch (intersection or difference) using published datasources. Offers useful checks that can be enabled such as `ensurePolygon`, `minSize`, `maxSize`, `enforceMinSize` and `enforceMaxSize`.

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

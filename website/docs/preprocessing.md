# Preprocessing

Preprocessing function are invoked by the SeaSketch platform, on a user-drawn shape, right after the user finishes drawing it. It's a specialized function that validates a drawn shape and potentially modifies it, such as to remove portions of the shape outside the planning boundary. This "clipping" of the shape allows a user to overdraw beyond the boundary and it will be clipped right to the edge of the boundary.

In the `src/functions` directory you will find four preprocessing functions that come with every project, and they are further configureable or customizeable to meet your needs:
`validatePolygon` - verifies shape is not self-crossing, is at least 500 square meters in size, and no larger than 1 million square kilometers.
`clipToLand` - clips the shape to just the portion on land, as defined by OpenStreeMap land polygons. Includes validatePolygon.
`clipToOcean` - clips the shape to remove the portion on land, as defined by OpenStreetMap land polygons. Includes validatePolygon.
`clipToOceanEez` - clips the shape to keep the portion within the boundary from the coastline to the outer boundary of the EEZ. Includes validatePolygon.

These preprocessing functions are already registered in the projects `geoprocessing.json` file to be deployeod as [AWS Lambda](https://aws.amazon.com/pm/lambda) functions. You can then select one of these preprocessors for your sketch class in your SeaSketch project and it will be called automatically right after a user finishes drawing a shape. If the preprocessing function throws with an error message, it will be presented to the user and they will be allowed to edit their shape and resubmit.

## Testing

Each preprocessing function alread has its own unit test and smoke test file. For example:

- Unit: `src/functions/validatePolygon.test.ts`
- Smoke: `src/functions/validatePolygonSmoke.test.ts`

**Unit tests** ensure the preprocessor produces exact output for very specific input features and configuration, and throws errors properly.

**Smoke tests** are about ensuring the preprocessor behaves properly for your project location, and that its results "look right" for a variety of input features. It does this by loading example shapes from the project `examples/features` directory. It then runs the preprocessing function on the examples, makes sure they produce "truthy" output, and saves them to `examples/output`.

To test your preprocessing functions, we need to create example features within the extent of your planning boundary. To do this you need the bounding box. QGIS and other tools can provide it.

Here's another way you can acquire it. Assume your planning boundary is in a file called `boundary.shp`. Use the `ogrinfo` command to get the metadata for that shape.

```bash
ogrinfo -so -json data/src/boundary
```

You will see deep in the output a `geometryFields` property, which contains the bounding box extent of your layer. Use the `jq` utility to extract this extent, here's an example:

```bash
ogrinfo -so -json data/src/boundary.shp | jq -c .layers[0].geometryFields[0].extent
[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]
```

With this extent you can now use the `genRandomPolygon` script to generate some features:

```bash
npx tsx scripts/genRandomPolygon.ts --outDir examples/features --filename polygon1.json --bbox "[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]"

npx tsx scripts/genRandomPolygon.ts --outDir examples/features --filename polygon2.json --bbox "[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]"
```

This will output an example Feature and an example FeatureCollection to `examples/features`.

Now run the tests:

```bash
npm test
```

You can now look at the geojson output visually by opening it in QGIS or pasting it into geojson.io. This is the best way to verify the preprocessor worked as expected. You should commit the output files to your git repository so that you can track changes over time.

## Creating A Geoprocessing Function

There are three approaches to creating a preprocessing function, from high level to low level:

- `clipToPolygonDatasources` - performns one or more clip operations on a polygon feature using one or more datasources.
- `clipToPolygonFeatures` - performs one or more clip operations on a polygon feature using one or more arrays of Polygon features.
- custom function - create your own preprocessing function from scratch, without the clip operations helper.

The example preprocessors that come with the project all use `clipToPolygonFeatures`.

Let's compare them.

### clipToPolygonDatasources

This method is useful if you use the `Datasources` feature of the framework. You will need to have imported a polygon datasource to clip using the `data:import` command, or added a third-party datasource to `project/datasources.json` manually.

This function will perform one or more clip operations on the input `feature`. For each clip operation, you specify the type (intersection or difference) and the datasource. It will fetch the features for the datasource using the appropriate client. The operations are applied in the order defined by the array.

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

### clipToPolygonFeatures

This method is useful if you import your datasources manually, have a third-party URL for a cloud-optimized datasource, or if you simply want to have lower-level control over how you access your project datasource. The preprocessors that come with the project all demonstrate fetching from a third-party VectorDataSource. Here are examples of importing JSON directly, and fetching features from a project datasource already published to S3 as a cloud-optimized flatgeobuf file.

#### Import GeoJSON features

Assume you have a file `data/src/boundary.js` containing the following:

```json
//ToDo
```

If you have a pure GeoJSON file `data/src/boundary.json`:

```json
{
  {
  "type": "FeatureCollection",
  "name": "multi_class_valuability",
  "crs": {
    "type": "name",
    "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
  },
  "features": [
    /// features
  ]
  }
}
```

you can import it directly and cast it to the appropriate type (or parse and validate the type with the library of your choice):

```typescript
import { FeatureCollection, Polygon } from "@seasketch/geoprocessing";
import boundary from "./boundary.json" assert { type: "json" };

const boundaryFC = boundary as FeatureCollection<Polygon>;
```

#### Fetch Flatgeobuf

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

Here's a custom preprocessing function that simply verifies the Polygon feature is valid and not self-crossing

```typescript
export async function validatePolygon(feature: Feature): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  return feature;
}
```

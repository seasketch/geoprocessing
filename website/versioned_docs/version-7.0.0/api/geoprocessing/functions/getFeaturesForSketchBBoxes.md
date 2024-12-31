# getFeaturesForSketchBBoxes()

```ts
function getFeaturesForSketchBBoxes<G>(
  sketch,
  fgbUrl,
  options,
): Promise<Feature<G>[]>;
```

Loads features from a FlatGeobuf referenced by URL, which intersect the
bounding boxes of each individual sketch in a SketchCollection, or a single
Sketch.

In the case of a SketchCollection, it is possible that duplicate features may
be fetched in the case of overlapping bounding boxes or very large features
that span multiple bounding boxes. This function will de-dupe those features.
The caller can
provide a uniqueIdProperty to de-dupe features (faster), otherwise a hash of
the feature coordinates will be used (slower).

If uniqueIdProperty is not provided, there is the potential for elimination
of features that are geometrically identical but have different properties.

## Type Parameters

| Type Parameter                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `G` _extends_ \| [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) \| [`Point`](../interfaces/Point.md) \| `MultiPoint` \| [`LineString`](../interfaces/LineString.md) \| [`MultiLineString`](../interfaces/MultiLineString.md) |

## Parameters

| Parameter                   | Type                                                                                                                                                                                                                                 | Description                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `sketch`                    | [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> | Sketch or SketchCollection                     |
| `fgbUrl`                    | `string`                                                                                                                                                                                                                             | FlatGeobuf location                            |
| `options`                   | `object`                                                                                                                                                                                                                             | -                                              |
| `options.uniqueIdProperty`? | `string`                                                                                                                                                                                                                             | name of unique ID property to de-dupe features |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<`G`\>[]\>

array of Features

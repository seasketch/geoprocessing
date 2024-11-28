# getFeaturesForSketchBBoxes()

```ts
function getFeaturesForSketchBBoxes(
   sketch, 
   fgbUrl, 
options): Promise<Feature<Polygon | MultiPolygon, GeoJsonProperties>[]>
```

Loads features from a FlatGeobuf referenced by URL, which intersect the
bounding boxes of each individual sketch in a SketchCollection, or a single
Sketch.

In the case of a SketchCollection, it is possible that duplicate features may
be fetched in the case of overlapping bounding boxes or very large features
that span multiple bounding boxes. This function will de-dupe those features.
Ideally, there is a feature.id property set. If not the caller can provide a
uniqueIdProperty to de-dupe features. If neither is provided, a hash of the
feature coordinates will be used.

If feature.id is not available, and uniqueIdProperty is not provided, there
is the potential for elimination of features that are geometrically identical
but have different properties.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketch` | [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> | Sketch or SketchCollection |
| `fgbUrl` | `string` | FlatGeobuf location |
| `options` | `object` | - |
| `options.uniqueIdProperty`? | `string` | - |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[]\>

array of Features

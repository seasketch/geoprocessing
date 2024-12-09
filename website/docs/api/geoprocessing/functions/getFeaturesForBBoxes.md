# getFeaturesForBBoxes()

```ts
function getFeaturesForBBoxes<G>(
   bboxes, 
   fgbUrl, 
options): Promise<Feature<G>[]>
```

Loads features from a FlatGeobuf referenced by URL, which intersect the
bounding boxes. Deduplicates features given uniqueIdProperty (faster) or
using md5 hash of feature coordinates (slower).

It is possible that duplicate features may be fetched in the case of
overlapping bounding boxes. This function will de-dupe those features. The caller can
provide a uniqueIdProperty to de-dupe features (faster), otherwise a hash of
the feature coordinates will be used (slower).

If uniqueIdProperty is not provided, there is the potential for elimination
of features that are geometrically identical but have different properties.

## Type Parameters

| Type Parameter |
| ------ |
| `G` *extends* \| [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) \| [`Point`](../interfaces/Point.md) \| `MultiPoint` \| [`LineString`](../interfaces/LineString.md) \| [`MultiLineString`](../interfaces/MultiLineString.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bboxes` | [`BBox`](../type-aliases/BBox.md)[] | the bounding boxes to fetch features for |
| `fgbUrl` | `string` | the URL of the FlatGeobuf file |
| `options` | `object` | - |
| `options.uniqueIdProperty`? | `string` | name of unique ID property to de-dupe features |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<`G`\>[]\>

array of Features

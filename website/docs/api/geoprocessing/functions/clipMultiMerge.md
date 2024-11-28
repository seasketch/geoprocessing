# clipMultiMerge()

```ts
function clipMultiMerge<P>(
   feature1, 
   features2, 
   operation, 
   options): Feature<Polygon | MultiPolygon> | null
```

Performs clip after first merging features2 coords into a single multipolygon.
Avoids errors in underlying clipping library when too many features in features2

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `P` *extends* `undefined` \| [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) | [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `feature1` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | polygon or multipolygon to clip |
| `features2` | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | collection of polygons or multipolygons to clip feature1 against |
| `operation` | `"intersection"` \| `"difference"` \| `"xor"` \| `"union"` | one of "union", "intersection", "xor", "difference" |
| `options` | `object` | - |
| `options.properties`? | `P` | properties to set on the resulting feature |

## Returns

[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| `null`

polygon or multipolygon feature result from clip operation, if no overlap then returns null

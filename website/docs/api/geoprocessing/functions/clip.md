# clip()

```ts
function clip<P>(
   features, 
   operation, 
   options): Feature<Polygon | MultiPolygon> | null
```

Performs one of 4 different clip operations on features

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `P` *extends* `undefined` \| [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) | [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `features` | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | FeatureCollection of Polygons or MultiPolygons. First feature is the subject, the rest are the clippers |
| `operation` | `"intersection"` \| `"difference"` \| `"xor"` \| `"union"` | one of "union", "intersection", "xor", "difference" |
| `options` | `object` | optional properties to set on the resulting feature |
| `options.properties`? | `P` | - |

## Returns

[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| `null`

clipped Feature of Polygon or MultiPolygon

# getHistogram()

```ts
function getHistogram(
   raster, 
   feat?, 
options?): Promise<Histogram>
```

Returns histogram of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `raster` | `Georaster` |
| `feat`? | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |
| `options`? | `object` |
| `options.classType`? | `"equal-interval"` \| `"quantile"` |
| `options.numClasses`? | `number` |
| `options.scaleType`? | `"nominal"` \| `"ratio"` |

## Returns

`Promise`\<[`Histogram`](../interfaces/Histogram.md)\>

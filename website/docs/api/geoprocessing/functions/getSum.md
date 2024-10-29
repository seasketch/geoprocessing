# getSum()

```ts
function getSum(raster, feat?): Promise<number>
```

Returns sum of raster value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `raster` | `Georaster` |
| `feat`? | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

## Returns

`Promise`\<`number`\>

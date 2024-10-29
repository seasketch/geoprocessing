# getArea()

```ts
function getArea(raster, feat?): Promise<number>
```

Returns area of valid raster cells (not nodata) overlapping with feature.  If no valid cells found, returns 0.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `raster` | `Georaster` |
| `feat`? | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

## Returns

`Promise`\<`number`\>

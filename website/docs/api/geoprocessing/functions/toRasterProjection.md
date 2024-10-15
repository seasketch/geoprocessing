# toRasterProjection()

```ts
function toRasterProjection(raster, feat?): any;
```

Reprojects a feature to the same projection as the raster.

## Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                                                                                 | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `raster`  | `Georaster`                                                                                                                                                                                                                                                                                                                                                                                                          |             |
| `feat`?   | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |             |

## Returns

`any`

feature in projection of raster

## Throws

if raster projection is not 4326 (backwards-compatibility) or 6933 (new equal area)

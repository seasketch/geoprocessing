# toMultiPolygon()

```ts
function toMultiPolygon(input): Feature<MultiPolygon, GeoJsonProperties>;
```

Converts collection of polygons or multipolygons to a single multipolygon

## Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                                                                                   | Description                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `input`   | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] | array or collection of polygons or multipolygons |

## Returns

[`Feature`](../interfaces/Feature.md)\<[`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>

multipolygon

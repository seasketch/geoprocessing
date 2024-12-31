# removeOverlap()

```ts
function removeOverlap(
  input,
): Feature<Polygon | MultiPolygon, GeoJsonProperties>;
```

Removes overlap between polygons and returns result as a single polygon or multipolygon
The result has no connection to the original features and their properties in this process

## Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                                                                                   | Description |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `input`   | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] |             |

## Returns

[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>

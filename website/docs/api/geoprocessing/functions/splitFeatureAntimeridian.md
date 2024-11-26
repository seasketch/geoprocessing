# splitFeatureAntimeridian()

```ts
function splitFeatureAntimeridian<G>(feature): Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>
```

Splits a Feature or FeatureCollection on the 180 degree antimeridian.
The bbox property of the result will have longitude coordinates that are
shifted/normalized to be within the range of -180 to 180.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` *extends* [`Geometry`](../type-aliases/Geometry.md) | [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | the feature or feature collection to split |

## Returns

[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>

the split feature or feature collection

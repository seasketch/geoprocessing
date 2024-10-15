# clipMultiMerge()

```ts
function clipMultiMerge<P>(
  feature1,
  features2,
  operation,
  options,
): Feature<Polygon | MultiPolygon> | null;
```

Performs clip by merging features2 coords into a single multipolygon.
Useful when you need features2 to be seen as a single unit when clipping feature1 (e.g. intersection)

## Type Parameters

| Type Parameter                                                                           | Default type                                                |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `P` _extends_ `undefined` \| [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) | [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) |

## Parameters

| Parameter             | Type                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `feature1`            | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>                     |
| `features2`           | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |
| `operation`           | `"union"` \| `"intersection"` \| `"xor"` \| `"difference"`                                                                                                                                                         |
| `options`             | `object`                                                                                                                                                                                                           |
| `options.properties`? | `P`                                                                                                                                                                                                                |

## Returns

[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| `null`

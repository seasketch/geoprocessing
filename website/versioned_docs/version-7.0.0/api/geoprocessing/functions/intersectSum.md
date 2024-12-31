# intersectSum()

```ts
function intersectSum(featureA, featuresB, sumProperty?): object;
```

Returns an object containing the sum value of features in B that intersect with featureA,
and the indices of the features in B that intersect with featureA
No support for partial overlap, counts the whole feature if it intersects.

## Parameters

| Parameter      | Type                                                                                                                                                                                             | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `featureA`     | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>   | single feature to intersect with featuresB                                           |
| `featuresB`    | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] | array of features                                                                    |
| `sumProperty`? | `string`                                                                                                                                                                                         | Property in featuresB with value to sum, if not defined each feature will count as 1 |

## Returns

`object`

Sum of features/feature property which overlap with the sketch, and a list of
indices for features that overlap with the sketch to be used in calculating total sum of
the sketch collection

### indices

```ts
indices: number[];
```

### sum

```ts
sum: number = sketchValue;
```

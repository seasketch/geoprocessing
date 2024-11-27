# intersectSum()

```ts
function intersectSum(
   featureA, 
   featuresB, 
   sumProperty?): object
```

Sums the value of intersecting features.  No support for partial, counts the whole feature

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `featureA` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | single feature to intersect with featuresB |
| `featuresB` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] | array of features |
| `sumProperty`? | `string` | Property in featuresB with value to sum, if not defined each feature will count as 1 |

## Returns

`object`

Sum of features/feature property which overlap with the sketch, and a list of
indices for features that overlap with the sketch to be used in calculating total sum of
the sketch collection

### indices

```ts
indices: number[];
```

### value

```ts
value: number = sketchValue;
```

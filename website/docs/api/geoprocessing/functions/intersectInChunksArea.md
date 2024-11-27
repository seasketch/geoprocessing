# intersectInChunksArea()

```ts
function intersectInChunksArea(
   featureA, 
   featuresB, 
   chunkSize): object
```

Calculates area overlap between a feature A and a feature array B.
Intersection is done in chunks on featuresB to avoid errors due to too many features

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `featureA` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | single feature to intersect with featuresB |
| `featuresB` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] | array of features |
| `chunkSize` | `number` | Size of array to split featuresB into, avoids intersect failure due to large array) |

## Returns

`object`

area of intersection of featureA with featuresB

### indices

```ts
indices: never[] = [];
```

### value

```ts
value: number = featureArea;
```

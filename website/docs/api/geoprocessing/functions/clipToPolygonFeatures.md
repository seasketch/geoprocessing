# clipToPolygonFeatures()

```ts
function clipToPolygonFeatures(
   feature, 
   clipLoader, 
options): Promise<Feature<Polygon | MultiPolygon>>
```

Takes a Polygon feature and returns the portion remaining after performing clipOperations
If results in multiple polygons then returns the largest

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | feature to clip |
| `clipLoader` | (`feature`) => `Promise`\<[`FeatureClipOperation`](../interfaces/FeatureClipOperation.md)[]\> | Load clip features from datasources for clip operations |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) | - |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>\>

## Throws

if input feature to clip is not a polygon or if enforceMaxSize is true and clipped feature is larger than maxSize, defaults to 500K km

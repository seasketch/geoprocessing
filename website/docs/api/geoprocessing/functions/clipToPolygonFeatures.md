# clipToPolygonFeatures()

```ts
function clipToPolygonFeatures(
   feature, 
   clipOperations, 
options): Promise<Feature<Polygon | MultiPolygon>>
```

Takes a Polygon feature and returns the portion remaining after performing clipOperations against one or more Polygon features

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | feature to clip |
| `clipOperations` | [`FeatureClipOperation`](../interfaces/FeatureClipOperation.md)[] | array of DatasourceClipOperations |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) | clip options |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>\>

clipped polygon

## Throws

if a datasource fetch returns no features or if nothing remains of feature after clip operations

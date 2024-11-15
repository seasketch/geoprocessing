# genClipToPolygonFeatures()

```ts
function genClipToPolygonFeatures(clipOperations, options): (feature) => Promise<Feature<Geometry, GeoJsonProperties>>
```

Returns a function that applies clip operations to a feature using other polygon features.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clipOperations` | [`FeatureClipOperation`](../interfaces/FeatureClipOperation.md)[] | - |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) | clip options |

## Returns

`Function`

clipped polygon

### Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>\>

## Throws

if a datasource fetch returns no features or if nothing remains of feature after clip operations

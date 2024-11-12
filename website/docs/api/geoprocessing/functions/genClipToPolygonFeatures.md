# genClipToPolygonFeatures()

```ts
function genClipToPolygonFeatures(clipOperations, options): (feature) => Promise<Feature<Geometry, GeoJsonProperties>>
```

Returns a function that applies clip operations to a feature using other polygon features.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `clipOperations` | [`FeatureClipOperation`](../interfaces/FeatureClipOperation.md)[] |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) |

## Returns

`Function`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>\>

## Throws

if clipped feature is larger than maxSize, defaults to 500K km

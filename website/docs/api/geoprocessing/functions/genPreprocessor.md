# genPreprocessor()

```ts
function genPreprocessor(clipLoader, options): (feature) => Promise<Feature<Geometry, GeoJsonProperties>>
```

Returns a preprocessor function given clipLoader function

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clipLoader` | (`feature`) => `Promise`\<[`FeatureClipOperation`](../interfaces/FeatureClipOperation.md)[]\> | Clip loader function |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) | - |

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

# ensureValidPolygon()

```ts
function ensureValidPolygon(feature, options): boolean
```

Returns true if feature is valid and meets requirements set by options.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | feature to validate |
| `options` | `object` | validation options |
| `options.allowSelfCrossing`? | `boolean` | - |
| `options.enforceMaxSize`? | `boolean` | Whether or not maxSize should be enforced and throw if larger |
| `options.enforceMinSize`? | `boolean` | Whether or not minSize should be enforced and throw if smaller |
| `options.maxSize`? | `number` | maxSize in square kilometers that polygon can be. Throws if larger. |
| `options.minSize`? | `number` | minimum size in square kilometers that polygon can be. Throws if smaller. |

## Returns

`boolean`

true if valid

## Throws

if polygon is invalid with reason

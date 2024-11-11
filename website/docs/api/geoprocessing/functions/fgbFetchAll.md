# ~~fgbFetchAll()~~

```ts
function fgbFetchAll<F>(url, box?): Promise<F[]>
```

Fetch features within bounding box and deserializes them, awaiting all of them before returning.
Useful when running a spatial function on the whole set.

## Type Parameters

| Type Parameter |
| ------ |
| `F` *extends* [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `box`? | [`BBox`](../type-aliases/BBox.md) |

## Returns

`Promise`\<`F`[]\>

## Deprecated

Use `loadFgb` instead.

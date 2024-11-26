# ~~fgbFetchAll()~~

```ts
function fgbFetchAll<F>(url, box?): Promise<F[]>
```

Fetch features from flatgeobuf at url within bounding box
Awaits all features before returning, rather than streaming them.

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

Use `loadCog` instead.

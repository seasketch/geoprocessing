# ~~loadFgb()~~

```ts
function loadFgb<F>(url, box?): Promise<F[]>
```

Fetch features within bounding box and deserializes them, awaiting all of them before returning.
Useful when running a spatial function on the whole set.

## Type Parameters

| Type Parameter |
| ------ |
| `F` *extends* [`Feature`](../../geoprocessing/interfaces/Feature.md)\<[`Geometry`](../../geoprocessing/type-aliases/Geometry.md), [`GeoJsonProperties`](../../geoprocessing/type-aliases/GeoJsonProperties.md)\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `box`? | [`BBox`](../../geoprocessing/type-aliases/BBox.md) |

## Returns

`Promise`\<`F`[]\>

## Deprecated

Use `loadFgb` instead.

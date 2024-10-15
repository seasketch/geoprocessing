# fgbFetchAll()

```ts
function fgbFetchAll<F>(url, box?): Promise<F[]>;
```

Fetch features within bounding box and deserializes them, awaiting all of them before returning.
Useful when running a spatial function on the whole set is faster than running
one at a time as the deserialize generator provides them

## Type Parameters

| Type Parameter                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `F` _extends_ [`Feature`](../../geoprocessing/interfaces/Feature.md)\<[`Geometry`](../../geoprocessing/type-aliases/Geometry.md), [`GeoJsonProperties`](../../geoprocessing/type-aliases/GeoJsonProperties.md)\> |

## Parameters

| Parameter | Type                                               |
| --------- | -------------------------------------------------- |
| `url`     | `string`                                           |
| `box`?    | [`BBox`](../../geoprocessing/type-aliases/BBox.md) |

## Returns

`Promise`\<`F`[]\>

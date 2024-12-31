# loadFgb()

```ts
function loadFgb<F>(url, bbox?): Promise<F[]>;
```

Fetch features from flatgeobuf at url that intersect with bounding box
Retries up to 3 times if fetch fails in error

## Type Parameters

| Type Parameter                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `F` _extends_ [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

## Parameters

| Parameter | Type                              | Description                                                 |
| --------- | --------------------------------- | ----------------------------------------------------------- |
| `url`     | `string`                          | url of flatgeobuf file                                      |
| `bbox`?   | [`BBox`](../type-aliases/BBox.md) | optional bounding box to fetch features that intersect with |

## Returns

`Promise`\<`F`[]\>

feature array

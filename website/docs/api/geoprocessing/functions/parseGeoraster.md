# parseGeoraster()

```ts
function parseGeoraster(data, metadata?, debug?): Promise<Georaster>;
```

## Parameters

| Parameter   | Type                                                                                                      | Description                                 |
| ----------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `data`      | \| `string` \| `object` \| `Buffer` \| `ArrayBuffer` \| [`TypedArray`](../type-aliases/TypedArray.md)[][] | raster pixel data, accepts variety of forms |
| `metadata`? | [`GeorasterMetadata`](../type-aliases/GeorasterMetadata.md)                                               | raster metadata                             |
| `debug`?    | `boolean`                                                                                                 | whether or not to print debug statements    |

## Returns

`Promise`\<[`Georaster`](../interfaces/Georaster.md)\>

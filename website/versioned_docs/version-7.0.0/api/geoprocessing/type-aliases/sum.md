# sum()

```ts
type sum: (raster, geom, test?, debug?) => number[];
```

## Parameters

| Parameter | Type                                                |
| --------- | --------------------------------------------------- |
| `raster`  | [`Georaster`](../interfaces/Georaster.md)           |
| `geom`    | `string` \| `InputPolygon` \| `null` \| `undefined` |
| `test`?   | (`cellValue`) => `boolean`                          |
| `debug`?  | `boolean`                                           |

## Returns

`number`[]

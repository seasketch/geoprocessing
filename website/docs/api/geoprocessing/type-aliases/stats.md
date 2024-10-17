# stats()

```ts
type stats: (raster, geom, test?, debug?) => StatsObject[];
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `raster` | [`Georaster`](../interfaces/Georaster.md) |
| `geom` | `string` \| `InputPolygon` \| `null` \| `undefined` |
| `test`? | (`cellValue`) => `boolean` |
| `debug`? | `boolean` |

## Returns

[`StatsObject`](../interfaces/StatsObject.md)[]

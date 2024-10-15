# CalcStatsOptions

options accepted by geoblaze.stats() to calc-stats library
See https://github.com/DanielJDufour/calc-stats/tree/main?tab=readme-ov-file#advanced-usage

## Extended by

- [`RasterStatsOptions`](RasterStatsOptions.md)

## Properties

### chunked?

```ts
optional chunked: boolean;
```

Whether or not to chunk calculations

***

### filter()?

```ts
optional filter: (index, value) => boolean;
```

Filter function to ignore raster values in stat calc

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `number` |
| `value` | `number` |

#### Returns

`boolean`

***

### noData?

```ts
optional noData: number;
```

Override nodata value, which is ignored in calculations

***

### stats?

```ts
optional stats: string[];
```

Stats to calculate

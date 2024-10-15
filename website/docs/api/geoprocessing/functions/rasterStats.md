# rasterStats()

```ts
function rasterStats(raster, options): Promise<StatsObject[]>;
```

Calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.
Defaults to calculating only sum stat
If no cells found, returns 0 or null value for each stat as appropriate.

## Parameters

| Parameter | Type                                                        |
| --------- | ----------------------------------------------------------- |
| `raster`  | `Georaster`                                                 |
| `options` | [`RasterStatsOptions`](../interfaces/RasterStatsOptions.md) |

## Returns

`Promise`\<[`StatsObject`](../interfaces/StatsObject.md)[]\>

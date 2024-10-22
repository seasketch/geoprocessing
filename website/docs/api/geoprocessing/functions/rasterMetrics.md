# rasterMetrics()

```ts
function rasterMetrics(raster, options): Promise<Metric[]>
```

Calculates summary metrics (stats/area) on given raster, optionally intersecting raster with provided feature (zonal statistics).
If feature is a collection, then calculate metrics for each individual feature as well as the collection as a whole.
This can be disabled with includeChildMetrics: false.  Defaults to assuming a continuous raster but also supports categorical option

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `raster` | `Georaster` | Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse() |
| `options` | [`OverlapRasterOptions`](../interfaces/OverlapRasterOptions.md) | - |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

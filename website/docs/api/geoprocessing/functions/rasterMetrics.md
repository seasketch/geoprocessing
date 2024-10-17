# rasterMetrics()

```ts
function rasterMetrics(raster, options): Promise<Metric[]>
```

Calculates stats on the provided raster and returns as an array of Metric objects (defaults to sum stat)
If sketch, then calculate overlap metrics, sketch collection will calculate metrics for each individual sketch within

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `raster` | `Georaster` | Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse() |
| `options` | `OverlapRasterOptions` | - |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

# ~~overlapRaster()~~

```ts
function overlapRaster(metricId, raster, sketch, options?): Promise<Metric[]>;
```

Returns metrics representing sketch overlap with raster.
If sketch collection, then calculate overlap for all child sketches also

## Parameters

| Parameter  | Type                                                                                                                                                                                                                                                                                   | Description                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `metricId` | `string`                                                                                                                                                                                                                                                                               | metricId value to assign to each measurement                                              |
| `raster`   | `Georaster`                                                                                                                                                                                                                                                                            | Cloud-optimized geotiff to calculate overlap with, loaded via loadCog or geoblaze.parse() |
| `sketch`   | [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> | single sketch or collection to calculate metrics for.                                     |
| `options`? | `Partial`\<`OverlapRasterOptions`\>                                                                                                                                                                                                                                                    | -                                                                                         |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

## Deprecated

- switch to overlapRasterSum

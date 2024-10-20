# overlapRasterGroupMetrics()

```ts
function overlapRasterGroupMetrics(options): Promise<Metric[]>
```

Generate overlap group metrics using rasterMetrics operation

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | - |
| `options.featuresByClass` | `Record`\<`string`, [`Georaster`](../interfaces/Georaster.md)\> | Raster to overlap, keyed by class ID |
| `options.groupIds` | `string`[] | Group identifiers - will generate group metric for each, even if result in zero value, so pre-filter if want to limit |
| `options.metricId` | `string` | Caller-provided metric ID |
| `options.metrics` | `object`[] | The metrics to group |
| `options.metricToGroup` | (`sketchMetric`) => `string` | Function that given sketch metric and group name, returns true if sketch is in the group, otherwise false |
| `options.onlyPresentGroups`? | `boolean` | only generate metrics for groups that sketches match to, rather than all |
| `options.sketch` | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | Sketch - single or collection |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

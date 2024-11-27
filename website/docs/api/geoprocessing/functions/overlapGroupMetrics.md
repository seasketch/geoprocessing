# overlapGroupMetrics()

```ts
function overlapGroupMetrics(options): Promise<Metric[]>
```

Given overlap metrics stratified by class and sketch, returns new metrics also stratified by group
Assumes a sketch is member of only one group, determined by caller-provided metricToGroup
For each group+class, calculates area of overlap between sketches in group and featuresByClass (with overlap between group sketches removed first)
Types of metrics returned:
 sketch metrics: copy of caller-provided sketch metrics with addition of group ID
 overall metric for each group+class: takes sketches in group, subtracts overlap between them and overlap with higher group sketches, and runs operation
If a group has no sketches in it, then no group metrics will be included for that group, and group+class metric will be 0

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | - |
| `options.featuresByClass` | `Record`\<`string`, [`Georaster`](../interfaces/Georaster.md)\> \| `Record`\<`string`, [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[]\> | features to overlap, keyed by class ID, use empty array if overlapArea operation |
| `options.groupIds` | `string`[] | Group identifiers |
| `options.metricId` | `string` | Caller-provided metric ID |
| `options.metrics` | `object`[] | The metrics to group |
| `options.metricToGroup` | (`sketchMetric`) => `string` | Function that given sketch metric returns the group ID |
| `options.onlyPresentGroups`? | `boolean` | only generate metrics for groups that sketches match to, rather than all groupIds |
| `options.operation` | `OverlapGroupOperation` | overlap operation, defaults to overlapFeatures |
| `options.sketch` | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | Sketch - single or collection |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

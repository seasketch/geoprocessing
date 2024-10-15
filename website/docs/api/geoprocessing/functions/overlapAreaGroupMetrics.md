# overlapAreaGroupMetrics()

```ts
function overlapAreaGroupMetrics(options): Promise<Metric[]>;
```

Generate overlap group metrics using overlapArea operation

## Parameters

| Parameter                    | Type                                                                                                                                                                             | Description                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `options`                    | `object`                                                                                                                                                                         | -                                                                                                         |
| `options.classId`            | `string`                                                                                                                                                                         | -                                                                                                         |
| `options.groupIds`           | `string`[]                                                                                                                                                                       | Group identifiers                                                                                         |
| `options.metricId`           | `string`                                                                                                                                                                         | Caller-provided metric ID                                                                                 |
| `options.metrics`            | `object`[]                                                                                                                                                                       | The metrics to group                                                                                      |
| `options.metricToGroup`      | (`sketchMetric`) => `string`                                                                                                                                                     | Function that given sketch metric and group name, returns true if sketch is in the group, otherwise false |
| `options.onlyPresentGroups`? | `boolean`                                                                                                                                                                        | only generate metrics for groups that sketches match to, rather than all                                  |
| `options.outerArea`          | `number`                                                                                                                                                                         | area of outer boundary (typically EEZ or planning area)                                                   |
| `options.sketch`             | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | Sketch - single or collection                                                                             |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

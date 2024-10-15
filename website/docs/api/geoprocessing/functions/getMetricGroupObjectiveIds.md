# getMetricGroupObjectiveIds()

```ts
function getMetricGroupObjectiveIds(metricGroup): string[];
```

Returns array of all objective IDs configured for the given MetricGroup.
If a class does not have an objectiveId assigned, then it gets the top-level
objectiveId

## Parameters

| Parameter                   | Type       | Description                                           |
| --------------------------- | ---------- | ----------------------------------------------------- |
| `metricGroup`               | `object`   | -                                                     |
| `metricGroup.classes`       | `object`[] | data classes used by group                            |
| `metricGroup.classKey`?     | `string`   | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string`   | Datasource to generate metrics from                   |
| `metricGroup.layerId`?      | `string`   | Optional ID of map layer associated with this metric  |
| `metricGroup.metricId`      | `string`   | Unique id of metric in project                        |
| `metricGroup.objectiveId`?  | `string`   | group level objective, applies to all classes         |
| `metricGroup.type`          | `string`   | Metric type                                           |

## Returns

`string`[]

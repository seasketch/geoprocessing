# getMetricGroupObjectiveId()

```ts
function getMetricGroupObjectiveId(metricGroup, classId?): string
```

Returns the top-level objective assigned for the given MetricGroup.
If a classID is also passed, returns the objective ID for that class within the metric group

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricGroup` | `object` | - |
| `metricGroup.classes` | `object`[] | data classes used by group |
| `metricGroup.classKey`? | `string` | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string` | Datasource to generate metrics from |
| `metricGroup.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `metricGroup.metricId`? | `string` | Unique id of metric in project |
| `metricGroup.objectiveId`? | `string` | group level objective, applies to all classes |
| `metricGroup.type`? | `string` | Metric type |
| `classId`? | `string` | - |

## Returns

`string`

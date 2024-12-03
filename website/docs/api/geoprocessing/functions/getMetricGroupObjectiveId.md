# getMetricGroupObjectiveId()

```ts
function getMetricGroupObjectiveId(metricGroup, classId?): string
```

Returns the objectiveId assigned to the given MetricGroup.
If classId provided, returns the objective ID assigned to data class with that classId, else fallback to metricGroup objectiveId.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricGroup` | `object` | the metricGroup to get the objective for |
| `metricGroup.classes` | `object`[] | data classes used by group |
| `metricGroup.classKey`? | `string` | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string` | Datasource to generate metrics from |
| `metricGroup.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `metricGroup.metricId`? | `string` | Unique id of metric in project |
| `metricGroup.objectiveId`? | `string` | group level objective, applies to all classes |
| `metricGroup.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |
| `classId`? | `string` | the classId to get the objective for |

## Returns

`string`

objectiveId

## Throws

if data class does not exist with classId

## Throws

if no objectiveId found for metricGroup or its class

# getMetricGroupObjectiveIds()

```ts
function getMetricGroupObjectiveIds(metricGroup): string[]
```

Returns array of objective IDs for the given MetricGroup.
If at least one class has an objectiveId assigned, then it returns those, missing classes with no objectiveId get the top-level objectiveId
If no class-level objectives are found, then it returns the top-level objectiveId
If no objectives are found, returns an empty array

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricGroup` | `object` | the metricGroup to get the objectives for |
| `metricGroup.classes` | `object`[] | data classes used by group |
| `metricGroup.classKey`? | `string` | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string` | Datasource to generate metrics from |
| `metricGroup.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `metricGroup.metricId` | `string` | Unique id of metric in project |
| `metricGroup.objectiveId`? | `string` | group level objective, applies to all classes |
| `metricGroup.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |

## Returns

`string`[]

array of objectiveIds

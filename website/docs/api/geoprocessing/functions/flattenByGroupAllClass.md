# flattenByGroupAllClass()

```ts
function flattenByGroupAllClass(
   collection, 
   groupMetrics, 
   totalMetrics): object[]
```

Aggregates metrics by group

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `collection` | [`NullSketchCollection`](../interfaces/NullSketchCollection.md) \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> | sketch collection metrics are for |
| `groupMetrics` | `object`[] | metrics with assigned groupId (except group total metric) and sketchIds for collection |
| `totalMetrics` | `object`[] | totals by class |

## Returns

`object`[]

one aggregate object for every groupId present in metrics.  Each object includes:
[numSketches] - count of child sketches in the group
[classId] - a percValue for each classId present in metrics for group
[value] - sum of value across all classIds present in metrics for group
[percValue] - given sum value across all classIds, contains ratio of total sum across all class IDs

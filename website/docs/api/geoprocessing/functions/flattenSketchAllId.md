# ~~flattenSketchAllId()~~

```ts
function flattenSketchAllId(
   metrics, 
   idProperty, 
   options): Record<string, MetricIdTypes>[]
```

Returns one aggregate object for every sketch ID present in metrics,
with additional property for each unique value for idProperty present for sketch.
Example - idProperty of 'classId', and two classes are present in metrics of 'classA', and 'classB'
then each flattened object will have two extra properties per sketch, .classA and .classB, each with the first metric value for that sketch/idProperty found

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metrics` | `object`[] | metrics with assigned sketch |
| `idProperty` | \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"` | - |
| `options` | `object` | - |
| `options.extraIdProperty`? | \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"` | - |

## Returns

`Record`\<`string`, [`MetricIdTypes`](../type-aliases/MetricIdTypes.md)\>[]

## Deprecated

# sortMetricsDisplayOrder()

```ts
function sortMetricsDisplayOrder(metrics, sortId, displayOrder): object[];
```

Sorts metrics by ID given a user-defined metric dimension (sortId) and array of ID
values in the order they should be sorted
Useful for applying a "display order" to metrics
Example - sortId = classId, displayOrder = ['sand','gravel','coral']

## Parameters

| Parameter      | Type                                                                             | Default value | Description |
| -------------- | -------------------------------------------------------------------------------- | ------------- | ----------- |
| `metrics`      | `object`[]                                                                       | `undefined`   |             |
| `sortId`       | \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"` | `"classId"`   |             |
| `displayOrder` | `string`[]                                                                       | `undefined`   |             |

## Returns

`object`[]

new array of sorted metrics

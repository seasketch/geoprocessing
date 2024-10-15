# sortMetrics()

```ts
function sortMetrics(metrics, sortIds): object[];
```

Sorts metrics to a consistent order for readability
Defaults to [metricId, classId, sketchId]

## Parameters

| Parameter | Type                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| `metrics` | `object`[]                                                                            |
| `sortIds` | ( \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"`)[] |

## Returns

`object`[]

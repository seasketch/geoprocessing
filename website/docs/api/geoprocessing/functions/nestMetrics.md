# nestMetrics()

```ts
function nestMetrics(metrics, ids): Record<string, any>
```

Recursively groups metrics by ID in order of ids specified to create arbitrary nested hierarchy for fast lookup.
Caller responsible for all metrics having the ID properties defined
If an id property is not defined on a metric, then 'undefined' will be used for the key

## Parameters

| Parameter | Type |
| ------ | ------ |
| `metrics` | `object`[] |
| `ids` | ( \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"`)[] |

## Returns

`Record`\<`string`, `any`\>

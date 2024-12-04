# rasterStatsToMetrics()

```ts
function rasterStatsToMetrics(statsObjects, options): object[]
```

Converts an array of geoblaze raster StatsObject to an array of Metrics

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `statsObjects` | [`StatsObject`](../interfaces/StatsObject.md)[] |  |
| `options` | `object` | - |
| `options.bandMetricProperty`? | \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"` | If multi-band raster, metric property name that raster bands are organized. Defaults to groupId |
| `options.bandMetricValues`? | `string`[] | If multi-band raster, array of indexed by band number to assign to bandMetricsProperty ['mangroves','coral']. ['band 1','band 2] |
| `options.categorical`? | `boolean` | If categorical raster, set to true |
| `options.categoryMetricProperty`? | \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"` | If categorical raster, metric property name that categories are organized. Defaults to classId |
| `options.categoryMetricValues`? | `string`[] | If categorical raster, array of values to create metrics for |
| `options.metricId`? | `string` | Optional metricId to be assigned. Don't use if you are calculating more than one stat because you won't be able to tell them apart |
| `options.metricIdPrefix`? | `string` | Optional caller-provided prefix to add to metricId in addition to stat name e.g. 'coral' with metrics of 'sum', 'count', 'area' will generate metric IDs of 'coral-sum', 'coral-count', 'coral-area' |
| `options.metricPartial`? | `Partial`\<`object`\> | Properties to append to metric extra |
| `options.truncate`? | `boolean` | - |

## Returns

`object`[]

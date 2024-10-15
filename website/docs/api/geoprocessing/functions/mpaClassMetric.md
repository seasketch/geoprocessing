# mpaClassMetric()

```ts
function mpaClassMetric(sketch, childAreaMetric): RegBasedClassificationMetric[]
```

Given sketch for rbcsMpa with rbcs activity userAttributes,
assumes mpa is a single zone mpa and returns metrics with mpa classification score

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketch` | [`NullSketch`](../interfaces/NullSketch.md) | sketch with GEAR_TYPES (multi), BOATING (single), and AQUACULTURE (single) user attributes |
| `childAreaMetric` | `object` | area metric for sketch |
| `childAreaMetric.classId` | `null` \| `string` | - |
| `childAreaMetric.extra`? | `Record`\<`string`, [`JSONValue`](../type-aliases/JSONValue.md)\> | - |
| `childAreaMetric.geographyId` | `null` \| `string` | - |
| `childAreaMetric.groupId` | `null` \| `string` | - |
| `childAreaMetric.metricId` | `string` | - |
| `childAreaMetric.sketchId` | `null` \| `string` | - |
| `childAreaMetric.value` | `number` | - |

## Returns

[`RegBasedClassificationMetric`](../interfaces/RegBasedClassificationMetric.md)[]

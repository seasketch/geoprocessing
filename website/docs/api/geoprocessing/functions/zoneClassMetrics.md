# zoneClassMetrics()

```ts
function zoneClassMetrics(sketch, childAreaMetrics?): RegBasedClassificationMetric[]
```

Given sketch for rbcsZone or collection of zone sketches with userAttributes for rcbs activities,
returns metrics with zone classification score as value.
If sketch collection, collection metric will have mpa classification score index as value

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketch` | [`NullSketch`](../interfaces/NullSketch.md) \| [`NullSketchCollection`](../interfaces/NullSketchCollection.md) | sketch or sketch collection with GEAR_TYPES (multi), BOATING (single), and AQUACULTURE (single) user attributes |
| `childAreaMetrics`? | `object`[] | - |

## Returns

[`RegBasedClassificationMetric`](../interfaces/RegBasedClassificationMetric.md)[]

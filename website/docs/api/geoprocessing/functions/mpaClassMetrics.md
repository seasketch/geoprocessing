# mpaClassMetrics()

```ts
function mpaClassMetrics(
  sketch,
  childAreaMetrics?,
): RegBasedClassificationMetric[];
```

Given sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes,
assumes each mpa is a single zone mpa and returns metrics with mpa classification score
Collection metric will have mpa classification score index as value

## Parameters

| Parameter           | Type                                                                                                           | Description                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `sketch`            | [`NullSketch`](../interfaces/NullSketch.md) \| [`NullSketchCollection`](../interfaces/NullSketchCollection.md) | sketch or sketch collection with GEAR_TYPES (multi), BOATING (single), and AQUACULTURE (single) user attributes |
| `childAreaMetrics`? | `object`[]                                                                                                     | -                                                                                                               |

## Returns

[`RegBasedClassificationMetric`](../interfaces/RegBasedClassificationMetric.md)[]

# flattenByGroupSketchAllClass()

```ts
function flattenByGroupSketchAllClass(
  sketches,
  groupMetrics,
  totals,
): GroupMetricSketchAgg[];
```

Flattens group class metrics, one for each group and sketch.
Each object includes the percValue for each class, and the total percValue with classes combined
groupId, sketchId, class1, class2, ..., total

## Parameters

| Parameter      | Type                                                                                                                                                      | Description                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `sketches`     | [`NullSketch`](../interfaces/NullSketch.md)[] \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\>[] | ToDo: is this needed? can the caller just pre-filter groupMetrics? |
| `groupMetrics` | `object`[]                                                                                                                                                | group metric data                                                  |
| `totals`       | `object`[]                                                                                                                                                | Totals by class                                                    |

## Returns

[`GroupMetricSketchAgg`](../type-aliases/GroupMetricSketchAgg.md)[]

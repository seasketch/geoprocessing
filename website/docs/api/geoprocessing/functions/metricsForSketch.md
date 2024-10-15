# metricsForSketch()

```ts
function metricsForSketch<M>(metrics, sketch): M[];
```

Returns metrics for given sketch (can be an array of sketches)

## Type Parameters

| Type Parameter         |
| ---------------------- |
| `M` _extends_ `object` |

## Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `metrics` | `M`[]                                                                                                                                                                                                                                                                                                              |
| `sketch`  | [`NullSketch`](../interfaces/NullSketch.md) \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`NullSketch`](../interfaces/NullSketch.md)[] \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\>[] |

## Returns

`M`[]

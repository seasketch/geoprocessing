# genSampleSketch()

```ts
function genSampleSketch<G>(geometry, name?): Sketch<G>;
```

Returns a Sketch with given geometry and Geometry type, Properties are reasonable random

## Type Parameters

| Type Parameter                                          | Default type                                                                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md) | [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) \| [`LineString`](../interfaces/LineString.md) |

## Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `geometry` | `G`      |
| `name`?    | `string` |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<`G`\>

# zeroSketch()

```ts
function zeroSketch<G>(sketch): Sketch<G>;
```

Given sketch, returns the mutated sketch with a zero polygon geometry (three [0,0] coordinates)

## Type Parameters

| Type Parameter                                                                                         |
| ------------------------------------------------------------------------------------------------------ |
| `G` _extends_ [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) |

## Parameters

| Parameter | Type                                                                                                   | Description |
| --------- | ------------------------------------------------------------------------------------------------------ | ----------- |
| `sketch`  | [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> |             |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<`G`\>

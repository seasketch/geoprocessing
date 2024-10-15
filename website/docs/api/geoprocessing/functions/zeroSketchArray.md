# zeroSketchArray()

```ts
function zeroSketchArray<G>(sketches): Sketch<G>[]
```

Given sketch array, returns the mutated sketches with a zero polygon geometry (three [0,0] coordinates)

## Type Parameters

| Type Parameter |
| ------ |
| `G` *extends* [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `sketches` | [`Sketch`](../interfaces/Sketch.md)\<`G`\>[] |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<`G`\>[]

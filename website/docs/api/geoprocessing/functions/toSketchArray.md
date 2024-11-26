# toSketchArray()

```ts
function toSketchArray<G>(input): Sketch<G>[]
```

Converts a Sketch or SketchCollection to a Sketch array, maintaining geometry type
Useful for putting in a consistent form that can be iterated over

## Type Parameters

| Type Parameter |
| ------ |
| `G` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Sketch`](../interfaces/Sketch.md)\<`G`\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> | sketch or sketch collection |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<`G`\>[]

array of sketches, if input is a sketch collection then it is the child sketches

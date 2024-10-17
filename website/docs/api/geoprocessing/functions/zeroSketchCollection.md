# zeroSketchCollection()

```ts
function zeroSketchCollection<G>(sketchCollection): SketchCollection<G>
```

Given sketch collection, returns the mutated collection with all child sketches switched to have zero polygon geometry (three [0,0] coordinates)

## Type Parameters

| Type Parameter |
| ------ |
| `G` *extends* [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketchCollection` | [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> |  |

## Returns

[`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>

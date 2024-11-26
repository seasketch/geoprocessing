# splitSketchAntimeridian()

```ts
function splitSketchAntimeridian<G>(sketch): Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>
```

Splits a Sketch or SketchCollection on the 180 degree antimeridian
The bbox property of the result will have longitude coordinates that are
shifted/normalized to be within the range of -180 to 180.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` | [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketch` | [`Sketch`](../interfaces/Sketch.md)\<`G`\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> | the sketch or sketch collection to split |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>

the split sketch or sketch collection

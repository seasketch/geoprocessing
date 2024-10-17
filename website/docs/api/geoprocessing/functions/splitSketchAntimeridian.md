# splitSketchAntimeridian()

```ts
function splitSketchAntimeridian<G>(sketch): Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>
```

Splits a Sketch or SketchCollection on the 180 degree antimeridian

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` | [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketch` | [`Sketch`](../interfaces/Sketch.md)\<`G`\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> |  |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>

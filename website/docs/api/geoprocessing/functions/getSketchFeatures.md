# getSketchFeatures()

```ts
function getSketchFeatures(sketch): (NullSketch | Sketch<SketchGeometryTypes>)[]
```

Given sketch or sketch collection, returns just the individual sketch features inside.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sketch` | [`NullSketch`](../interfaces/NullSketch.md) \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`NullSketchCollection`](../interfaces/NullSketchCollection.md) \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> |  |

## Returns

([`NullSketch`](../interfaces/NullSketch.md) \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\>)[]

# toNullSketch()

```ts
function toNullSketch(sketch, useNull): NullSketch | NullSketchCollection;
```

Returns sketch or sketch collection with null geometry

## Parameters

| Parameter | Type                                                                                                                                                                                                                                 | Default value |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `sketch`  | [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> | `undefined`   |
| `useNull` | `boolean`                                                                                                                                                                                                                            | `false`       |

## Returns

[`NullSketch`](../interfaces/NullSketch.md) \| [`NullSketchCollection`](../interfaces/NullSketchCollection.md)

# genSampleSketchCollectionFromSketches()

```ts
function genSampleSketchCollectionFromSketches<G>(
  sketches,
  name?,
): SketchCollection<G>;
```

Given feature collection, return a sketch collection with reasonable random props.
The geometry type of the returned collection will match the one passed in

## Type Parameters

| Type Parameter                                          | Default type                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md) | [`Polygon`](../interfaces/Polygon.md) \| [`LineString`](../interfaces/LineString.md) |

## Parameters

| Parameter  | Type                                         |
| ---------- | -------------------------------------------- |
| `sketches` | [`Sketch`](../interfaces/Sketch.md)\<`G`\>[] |
| `name`?    | `string`                                     |

## Returns

[`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>

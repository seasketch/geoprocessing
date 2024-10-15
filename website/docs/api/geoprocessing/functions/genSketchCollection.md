# genSketchCollection()

```ts
function genSketchCollection<G>(sketches, options): SketchCollection<G>;
```

Given array of sketches, return a sketch collection with given properties.
Generates reasonable default values for any properties not passed in
The geometry type of the returned collection will match the one passed in
Properties of sketches are retained

## Type Parameters

| Type Parameter                                          | Default type                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md) | [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Parameters

| Parameter                 | Type                                                  |
| ------------------------- | ----------------------------------------------------- |
| `sketches`                | [`Sketch`](../interfaces/Sketch.md)\<`G`\>[]          |
| `options`                 | `object`                                              |
| `options.createdAt`?      | `string`                                              |
| `options.id`?             | `string`                                              |
| `options.name`?           | `string`                                              |
| `options.sketchClassId`?  | `string`                                              |
| `options.updatedAt`?      | `string`                                              |
| `options.userAttributes`? | [`UserAttribute`](../type-aliases/UserAttribute.md)[] |

## Returns

[`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>

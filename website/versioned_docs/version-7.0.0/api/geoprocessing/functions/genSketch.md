# genSketch()

```ts
function genSketch<G>(options): Sketch<G>;
```

Returns a Sketch with given features geometry and properties. Reasonable defaults are given for properties not provided
Default geometry is a square from 0,0 to 1,1

## Type Parameters

| Type Parameter                                          | Default type                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md) | [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Parameters

| Parameter                 | Type                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `options`                 | `object`                                                                                                  |
| `options.createdAt`?      | `string`                                                                                                  |
| `options.feature`?        | [`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |
| `options.id`?             | `string`                                                                                                  |
| `options.name`?           | `string`                                                                                                  |
| `options.sketchClassId`?  | `string`                                                                                                  |
| `options.updatedAt`?      | `string`                                                                                                  |
| `options.userAttributes`? | [`UserAttribute`](../type-aliases/UserAttribute.md)[]                                                     |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<`G`\>

# featureToSketchCollection()

```ts
function featureToSketchCollection<G>(
  fc,
  name,
  sketchProperties,
): SketchCollection<G>;
```

Converts FeatureCollection to SketchCollection with reasonable defaults given for sketch properties if not provided

## Type Parameters

| Type Parameter                                                                |
| ----------------------------------------------------------------------------- |
| `G` _extends_ [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Parameters

| Parameter          | Type                                                                                                                          | Default value |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `fc`               | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | `undefined`   |
| `name`             | `string`                                                                                                                      | `"sketches"`  |
| `sketchProperties` | `Partial`\<[`SketchProperties`](../type-aliases/SketchProperties.md)\>                                                        | `{}`          |

## Returns

[`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>

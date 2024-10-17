# featureToSketch()

```ts
function featureToSketch<G>(
   feat, 
   name, 
sketchProperties): Sketch<G>
```

Converts Feature to Sketch with reasonable defaults given for sketch properties if not provided

## Type Parameters

| Type Parameter |
| ------ |
| `G` *extends* [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `feat` | [`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | `undefined` |
| `name` | `string` | `"sketches"` |
| `sketchProperties` | `Partial`\<[`SketchProperties`](../type-aliases/SketchProperties.md)\> | `{}` |

## Returns

[`Sketch`](../interfaces/Sketch.md)\<`G`\>

# genSampleSketchCollection()

```ts
function genSampleSketchCollection<G>(fc, name?): SketchCollection<G>
```

Given feature collection, return a sketch collection with reasonable random props.
The geometry type of the returned collection will match the one passed in

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` *extends* [`Geometry`](../type-aliases/Geometry.md) | [`Polygon`](../interfaces/Polygon.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fc` | [`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |
| `name`? | `string` |

## Returns

[`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>

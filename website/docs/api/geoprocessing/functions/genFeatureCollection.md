# genFeatureCollection()

```ts
function genFeatureCollection<G>(features, options): FeatureCollection<G, GeoJsonProperties>
```

Given array of features, return a feature collection with given properties.
Generates reasonable default values for any properties not passed in
The geometry type of the returned collection will match the one passed in
Properties of features are retained

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` *extends* [`Geometry`](../type-aliases/Geometry.md) | [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `features` | [`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] |
| `options` | `object` |
| `options.id`? | `string` |
| `options.name`? | `string` |

## Returns

[`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>

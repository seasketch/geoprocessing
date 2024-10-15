# genRandomPolygons()

```ts
function genRandomPolygons(
  config,
): FeatureCollection<Geometry, GeoJsonProperties>;
```

Generates random polygons within provided bounds. numPolygons defaults to 300, max_radial_length to 0.5
Wrapper around @turf/random - https://turfjs.org/docs/#randomPolygon

## Parameters

| Parameter                   | Type                              |
| --------------------------- | --------------------------------- |
| `config`                    | `object`                          |
| `config.bounds`             | [`BBox`](../type-aliases/BBox.md) |
| `config.max_radial_length`? | `number`                          |
| `config.numPolygons`?       | `number`                          |

## Returns

[`FeatureCollection`](../interfaces/FeatureCollection.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>

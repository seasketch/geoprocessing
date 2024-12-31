# FeatureCollection\<G, P\>

A collection of feature objects.
https://tools.ietf.org/html/rfc7946#section-3.3

## Extends

- `GeoJsonObject`

## Type Parameters

| Type Parameter                                                    | Default type                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md) \| `null` | [`Geometry`](../type-aliases/Geometry.md)                   |
| `P`                                                               | [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md) |

## Properties

### bbox?

```ts
optional bbox: BBox;
```

Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
The value of the bbox member is an array of length 2\*n where n is the number of dimensions
represented in the contained geometries, with all axes of the most southwesterly point
followed by all axes of the more northeasterly point.
The axes order of a bbox follows the axes order of geometries.
https://tools.ietf.org/html/rfc7946#section-5

#### Inherited from

`GeoJsonObject.bbox`

---

### features

```ts
features: Feature < G, P > [];
```

---

### type

```ts
type: "FeatureCollection";
```

Specifies the type of GeoJSON object.

#### Overrides

`GeoJsonObject.type`

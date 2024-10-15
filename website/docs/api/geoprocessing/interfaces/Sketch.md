# Sketch\<G\>

## Extends

- `Omit`\<[`Feature`](Feature.md), `"geometry"` \| `"properties"`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` | [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Properties

### bbox?

```ts
optional bbox: BBox;
```

Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
The value of the bbox member is an array of length 2*n where n is the number of dimensions
represented in the contained geometries, with all axes of the most southwesterly point
followed by all axes of the more northeasterly point.
The axes order of a bbox follows the axes order of geometries.
https://tools.ietf.org/html/rfc7946#section-5

#### Overrides

`Omit.bbox`

***

### geometry

```ts
geometry: G;
```

***

### id?

```ts
optional id: string | number;
```

A value that uniquely identifies this feature in a
https://tools.ietf.org/html/rfc7946#section-3.2.

#### Inherited from

`Omit.id`

***

### properties

```ts
properties: SketchProperties;
```

***

### type

```ts
type: "Feature";
```

Specifies the type of GeoJSON object.

#### Inherited from

`Omit.type`

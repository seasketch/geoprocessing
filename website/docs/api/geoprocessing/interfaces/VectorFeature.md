# VectorFeature

A feature object which contains a geometry and associated properties.
https://tools.ietf.org/html/rfc7946#section-3.2

## Extends

- [`Feature`](Feature.md)\<[`Polygon`](Polygon.md) \| [`MultiPolygon`](MultiPolygon.md)\>

## Properties

### bbox

```ts
bbox: BBox;
```

Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
The value of the bbox member is an array of length 2*n where n is the number of dimensions
represented in the contained geometries, with all axes of the most southwesterly point
followed by all axes of the more northeasterly point.
The axes order of a bbox follows the axes order of geometries.
https://tools.ietf.org/html/rfc7946#section-5

#### Overrides

[`Feature`](Feature.md).[`bbox`](Feature.md#bbox)

***

### geometry

```ts
geometry: Polygon | MultiPolygon;
```

The feature's geometry

#### Inherited from

[`Feature`](Feature.md).[`geometry`](Feature.md#geometry)

***

### id?

```ts
optional id: string | number;
```

A value that uniquely identifies this feature in a
https://tools.ietf.org/html/rfc7946#section-3.2.

#### Inherited from

[`Feature`](Feature.md).[`id`](Feature.md#id)

***

### properties

```ts
properties: GeoJsonProperties;
```

Properties associated with this feature.

#### Inherited from

[`Feature`](Feature.md).[`properties`](Feature.md#properties)

***

### type

```ts
type: "Feature";
```

Specifies the type of GeoJSON object.

#### Inherited from

[`Feature`](Feature.md).[`type`](Feature.md#type)

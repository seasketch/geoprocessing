# GeoprocessingRequest\<G\>

```ts
type GeoprocessingRequest<G>: Omit<GeoprocessingRequestModel<G>, "extraParams"> & object;
```

Geoprocessing request sent via HTTP GET, with extraParams as url-encoded JSON string

## Type declaration

### extraParams?

```ts
optional extraParams: string;
```

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `G` | [`SketchGeometryTypes`](SketchGeometryTypes.md) |

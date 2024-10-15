# PreprocessingRequest

## Properties

### extraParams?

```ts
optional extraParams: string;
```

Additional runtime parameters

---

### feature

```ts
feature: Feature<Polygon | Point | LineString, GeoJsonProperties>;
```

Geometry drawn by the user. Typically simple

---

### responseFormat?

```ts
optional responseFormat: "application/json";
```

Defaults to geojson

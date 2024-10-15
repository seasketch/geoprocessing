# GeoprocessingRequestModel\<G\>

Geoprocessing request internal data model, with full objects, no JSON strings

## Type Parameters

| Type Parameter | Default type                                                    |
| -------------- | --------------------------------------------------------------- |
| `G`            | [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Properties

### cacheKey?

```ts
optional cacheKey: string;
```

Cache key for this task

---

### checkCacheOnly?

```ts
optional checkCacheOnly: string;
```

If true, only check cache and do not run worker

---

### disableCache?

```ts
optional disableCache: boolean;
```

If true, task state and result is not cached server-side. Only use for sync functions in a worker use case where its results are not needed

---

### extraParams?

```ts
optional extraParams: GeoprocessingRequestParams;
```

Additional runtime parameters

---

### geometry?

```ts
optional geometry: Sketch<G> | SketchCollection<G>;
```

Sketch JSON

---

### geometryGeobuf?

```ts
optional geometryGeobuf: string;
```

Sketch Geobuf base64 string

---

### geometryUri?

```ts
optional geometryUri: string;
```

URL to fetch Sketch JSON

---

### onSocketConnect?

```ts
optional onSocketConnect: string;
```

---

### token?

```ts
optional token: string;
```

---

### wss?

```ts
optional wss: string;
```

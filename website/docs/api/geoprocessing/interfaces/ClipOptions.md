# ClipOptions

Optional parameters for preprocessor function

## Properties

### enforceMaxSize?

```ts
optional enforceMaxSize: boolean;
```

Whether or not maxSize should be enforced and throw

---

### ensurePolygon?

```ts
optional ensurePolygon: boolean;
```

Ensures result is a polygon. If clip results in multipolygon, returns the largest component

---

### maxSize?

```ts
optional maxSize: number;
```

maxSize in square kilometers that clipped polygon result can be. Preprocessor function will throw if larger.

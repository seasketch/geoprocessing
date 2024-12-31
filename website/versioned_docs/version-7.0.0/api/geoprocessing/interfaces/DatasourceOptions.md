# DatasourceOptions

## Properties

### bbox?

```ts
optional bbox: BBox;
```

Fetches features overlapping with bounding box

---

### propertyFilter?

```ts
optional propertyFilter: object;
```

Filter features by property having one or more specific values

#### property

```ts
property: string;
```

#### values

```ts
values: (string | number)[];
```

---

### unionProperty?

```ts
optional unionProperty: string;
```

Provide if you have subdivided dataset and want to rebuild (union) subdivided polygons based on having same value for this property name

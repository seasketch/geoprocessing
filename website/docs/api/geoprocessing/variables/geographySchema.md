# geographySchema

```ts
const geographySchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

A geographic area (Polygon) for planning. Typically used to represent a planning area

## Type declaration

### bboxFilter

```ts
bboxFilter: ZodOptional<
  ZodUnion<
    [
      ZodTuple<[ZodNumber, ZodNumber, ZodNumber, ZodNumber], null>,
      ZodTuple<
        [ZodNumber, ZodNumber, ZodNumber, ZodNumber, ZodNumber, ZodNumber],
        null
      >,
    ]
  >
>;
```

Optional, constrain geography to only features within a bounding box

### datasourceId

```ts
datasourceId: ZodString;
```

ID of datasource containing geography boundary

### display

```ts
display: ZodString;
```

Display name for the geography

### geographyId

```ts
geographyId: ZodString;
```

Unique name of the geography

### groups

```ts
groups: ZodOptional<ZodArray<ZodString, "many">>;
```

Optional, sub-geography identifier. Useful when you have multiple groupings/levels of geographies and want to select for a specific group

### layerId

```ts
layerId: ZodOptional<ZodString>;
```

Optional, defines external layer for visualizing the geography

### precalc

```ts
precalc: ZodBoolean;
```

Optional, defines whether or not precalc should be run for this geography

### propertyFilter

```ts
propertyFilter: ZodOptional<
  ZodObject<object, "strip", ZodTypeAny, object, object>
>;
```

Required if external datasource used, defines filter to constrain geography features, matches feature property having one or more specific values

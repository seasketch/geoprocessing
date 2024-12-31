# dataClassSchema

```ts
const dataClassSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Represents a single class of data. Ties it to an underlying datasource, holds attributes used for displaying in user interfaces

## Type declaration

### classId

```ts
classId: ZodString;
```

Unique identifier for class in project

### classKey

```ts
classKey: ZodOptional<ZodString>;
```

Optional datasource class key used to source classIds

### datasourceId

```ts
datasourceId: ZodOptional<ZodString>;
```

Datasource for single data class

### display

```ts
display: ZodString;
```

Name of class suitable for user display

### layerId

```ts
layerId: ZodOptional<ZodString>;
```

Optional ID of map layer associated with this class

### numericClassId

```ts
numericClassId: ZodOptional<ZodNumber>;
```

Optional unique number used by some datasets (e.g. raster) to represent data class instead of string

### objectiveId

```ts
objectiveId: ZodOptional<ZodString>;
```

class level objective

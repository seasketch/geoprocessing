# SketchProperties

```ts
type SketchProperties: Record<string, any> & object;
```

Properties of a Sketch, defines known keys as well as unknown for extensiblity

## Type declaration

### childProperties?

```ts
optional childProperties: SketchProperties[];
```

This is used on rare occasion to provide the sketch properties of a SketchCollections child sketches

### createdAt

```ts
createdAt: ISO8601DateTime;
```

Last updated ISO 8601 timestamp

### id

```ts
id: string;
```

Unique sketch ID

### isCollection

```ts
isCollection: boolean;
```

True if these are properties for a SketchCollection, false if Sketch

### name

```ts
name: string;
```

Name specified by the author of the sketch

### sketchClassId

```ts
sketchClassId: string;
```

Unique ID of class of sketch

### updatedAt

```ts
updatedAt: ISO8601DateTime;
```

Last updated ISO 8601 timestamp

### userAttributes

```ts
userAttributes: UserAttribute[];
```

User-defined attributes with values for Sketch.  Defines known keys as well as unknown for extensiblity

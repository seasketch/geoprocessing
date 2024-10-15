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

### createdAt

```ts
createdAt: ISO8601DateTime;
```

### id

```ts
id: string;
```

### isCollection

```ts
isCollection: boolean;
```

### name

```ts
name: string;
```

Name specified by the author of the sketch

### sketchClassId

```ts
sketchClassId: string;
```

### updatedAt

```ts
updatedAt: ISO8601DateTime;
```

### userAttributes

```ts
userAttributes: UserAttribute[];
```

# packageSchema

```ts
const packageSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Schema for npm package.json metadata, as found in the wild

## Type declaration

### author

```ts
author: ZodString;
```

### bugs

```ts
bugs: ZodOptional<ZodRecord<ZodString, ZodString>>;
```

### dependencies

```ts
dependencies: ZodOptional<ZodRecord<ZodString, ZodString>>;
```

### description

```ts
description: ZodString;
```

### devDependencies

```ts
devDependencies: ZodOptional<ZodRecord<ZodString, ZodString>>;
```

### homepage

```ts
homepage: ZodOptional<ZodString>;
```

### keywords

```ts
keywords: ZodOptional<ZodArray<ZodString, "many">>;
```

### license

```ts
license: ZodString;
```

### name

```ts
name: ZodString;
```

### private

```ts
private: ZodOptional<ZodBoolean>;
```

### repository

```ts
repository: ZodOptional<ZodRecord<ZodString, ZodString>>;
```

### repositoryUrl

```ts
repositoryUrl: ZodOptional<ZodString>;
```

### scripts

```ts
scripts: ZodOptional<ZodRecord<ZodString, ZodString>>;
```

### type

```ts
type: ZodOptional<ZodString>;
```

### version

```ts
version: ZodString;
```

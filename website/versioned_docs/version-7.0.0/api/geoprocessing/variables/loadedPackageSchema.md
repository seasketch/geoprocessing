# loadedPackageSchema

```ts
const loadedPackageSchema: ZodObject<
  object,
  "strip",
  ZodTypeAny,
  object,
  object
>;
```

Stricter schema for npm package.json metadata, with most fields guaranteed present

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
dependencies: ZodRecord<ZodString, ZodString>;
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
keywords: ZodArray<ZodString, "many">;
```

### license

```ts
license: ZodString;
```

### lint-staged

```ts
lint-staged: ZodOptional<ZodRecord<ZodString, ZodString>>;
```

### name

```ts
name: ZodString;
```

### private

```ts
private: ZodBoolean;
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
scripts: ZodRecord<ZodString, ZodString>;
```

### type

```ts
type: ZodOptional<ZodString>;
```

### version

```ts
version: ZodString;
```

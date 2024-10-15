# internalDatasourceSchema

```ts
const internalDatasourceSchema: ZodObject<
  object,
  "strip",
  ZodTypeAny,
  object,
  object
>;
```

Timestamp properties to ease syncing with local/published datasource files

## Type declaration

### created

```ts
created: ZodString;
```

Datasource creation timestamp

### lastUpdated

```ts
lastUpdated: ZodString;
```

Datasource updated timestamp

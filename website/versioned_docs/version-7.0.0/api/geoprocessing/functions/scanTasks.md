# scanTasks()

```ts
function scanTasks(
  docClient,
  tableName,
  serviceName?,
): Paginator<ScanCommandOutput>;
```

## Parameters

| Parameter      | Type               | Description                       |
| -------------- | ------------------ | --------------------------------- |
| `docClient`    | `DynamoDBDocument` | DynamoDB Document client          |
| `tableName`    | `string`           | Task table name                   |
| `serviceName`? | `string`           | Optional serviceName to filter by |

## Returns

`Paginator`\<`ScanCommandOutput`\>

# batchDelete()

```ts
function batchDelete(
   docClient, 
   tableName, 
   deleteCommandInput, 
   retryCount, 
maxRetries): Promise<void>
```

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `docClient` | `DynamoDBDocument` | `undefined` |
| `tableName` | `string` | `undefined` |
| `deleteCommandInput` | `BatchWriteCommandInput` | `undefined` |
| `retryCount` | `number` | `0` |
| `maxRetries` | `number` | `10` |

## Returns

`Promise`\<`void`\>

# updateCommandsSync()

```ts
function updateCommandsSync(db, commands): Promise<void>
```

Run dynamodb update commands synchronously to avoid throttling, retrying on ThroughputError

## Parameters

| Parameter | Type |
| ------ | ------ |
| `db` | `DynamoDBDocument` |
| `commands` | `UpdateCommand`[] |

## Returns

`Promise`\<`void`\>

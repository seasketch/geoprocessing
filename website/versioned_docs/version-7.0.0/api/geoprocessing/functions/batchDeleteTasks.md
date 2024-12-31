# batchDeleteTasks()

```ts
function batchDeleteTasks(docClient, taskKeys, tableName): Promise<void>;
```

Batch delete array of tasks

## Parameters

| Parameter   | Type                                      |
| ----------- | ----------------------------------------- |
| `docClient` | `DynamoDBDocument`                        |
| `taskKeys`  | [`TaskKey`](../type-aliases/TaskKey.md)[] |
| `tableName` | `string`                                  |

## Returns

`Promise`\<`void`\>

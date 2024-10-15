# finishTask()

```ts
function finishTask(
  url,
  payload,
  abortController,
  setState,
  currServiceName,
  socket,
): Promise<void>;
```

Finishes task by hitting the remote cache, updating the hook with the task result and cleaning up

## Parameters

| Parameter         | Type  |
| ----------------- | ----- |
| `url`             | `any` |
| `payload`         | `any` |
| `abortController` | `any` |
| `setState`        | `any` |
| `currServiceName` | `any` |
| `socket`          | `any` |

## Returns

`Promise`\<`void`\>

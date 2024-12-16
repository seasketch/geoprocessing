# callWithRetry()

```ts
function callWithRetry<T>(
   fn, 
   args, 
options): Promise<Awaited<ReturnType<T>>>
```

Calls given function and if throws error it recursively retries up to maxTry times

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* (...`arg0`) => `any` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | `T` | the function to call |
| `args` | `Parameters`\<`T`\> | arguments to pass to the function when it is called |
| `options` | `object` | - |
| `options.logEachFailure`? | `boolean` | whether to console.log each failure, defaults to true |
| `options.maxTry`? | `number` | the maximum number of times to try again, defaults to 3 |
| `options.retryCount`? | `number` | the current retry count, defaults to 1 |

## Returns

`Promise`\<`Awaited`\<`ReturnType`\<`T`\>\>\>

the result of calling the function

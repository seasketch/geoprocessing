# groupBy()

```ts
function groupBy<T, K>(list, getKey): Record<K, T[]>
```

Similar to lodash groupBy

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* `string` \| `number` \| `symbol` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `list` | `T`[] |
| `getKey` | (`item`) => `K` |

## Returns

`Record`\<`K`, `T`[]\>

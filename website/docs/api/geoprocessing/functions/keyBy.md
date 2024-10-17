# keyBy()

```ts
function keyBy<T, K>(list, getKey): Record<K, T>
```

Similar to lodash keyBy

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

`Record`\<`K`, `T`\>

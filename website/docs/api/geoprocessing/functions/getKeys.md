# getKeys()

```ts
function getKeys<T>(obj): keyof T[]
```

Object.keys helper that returns strongly typed key values.  Uses assertion so make sure your type covers all the keys!

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |

## Returns

keyof `T`[]

# hasOwnProperty()

```ts
function hasOwnProperty<X, Y>(obj, prop): obj is X & Record<Y, unknown>
```

Type narrowing to allow property checking when object can be multiple types
https://fettblog.eu/typescript-hasownproperty/
Any code inside a block guarded by a conditional call to this function will have type narrowed to X

## Type Parameters

| Type Parameter |
| ------ |
| `X` *extends* `object` |
| `Y` *extends* `PropertyKey` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `X` |
| `prop` | `Y` |

## Returns

`obj is X & Record<Y, unknown>`

# getFirstFromParam()

```ts
function getFirstFromParam<P>(paramName, params, options): undefined | string;
```

Returns first element from param object at paramName key. Parameter can be string or array of strings

## Type Parameters

| Type Parameter                                                            |
| ------------------------------------------------------------------------- |
| `P` _extends_ [`DefaultExtraParams`](../interfaces/DefaultExtraParams.md) |

## Parameters

| Parameter           | Type      | Description                                         |
| ------------------- | --------- | --------------------------------------------------- |
| `paramName`         | `string`  | name of array parameter to extract from extraParams |
| `params`            | `P`       | the object containing parameters                    |
| `options`           | `object`  | -                                                   |
| `options.required`? | `boolean` | -                                                   |

## Returns

`undefined` \| `string`

the first element ih the parameter or undefined if not found

## Throws

if required = true and param is missing or its array is empty

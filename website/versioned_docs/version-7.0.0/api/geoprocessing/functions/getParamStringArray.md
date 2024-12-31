# getParamStringArray()

```ts
function getParamStringArray<P>(paramName, params): undefined | string[];
```

Validates and returns string[] parameter from extraParams. If param missing it returns an empty array

## Type Parameters

| Type Parameter                                                            |
| ------------------------------------------------------------------------- |
| `P` _extends_ [`DefaultExtraParams`](../interfaces/DefaultExtraParams.md) |

## Parameters

| Parameter   | Type     | Description                                         |
| ----------- | -------- | --------------------------------------------------- |
| `paramName` | `string` | name of array parameter to extract from extraParams |
| `params`    | `P`      | parameter object                                    |

## Returns

`undefined` \| `string`[]

string[]

## Throws

Error if parameter contains non-string values

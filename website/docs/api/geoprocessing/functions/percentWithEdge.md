# percentWithEdge()

```ts
function percentWithEdge(val, options): string
```

Special percent formatter designed to produce readable percent values for
display with special handling of numbers within some edge range of
user-defined lower or upper bounds.  Defaults to handle only lower edge with
lowerBound = 0 and lower = .001. All bound values are expected to be in
decimal percent.  So 1/10th of a percent is .001

## Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |
| `options` | [`PercentEdgeOptions`](../interfaces/PercentEdgeOptions.md) |

## Returns

`string`

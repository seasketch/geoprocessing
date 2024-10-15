# percentGoalWithEdge()

```ts
function percentGoalWithEdge(
   val, 
   goal, 
   options?): string
```

Special percent formatter designed to produce readable percent values for display given an upper percent goal
All parameters are expected to be decimal percent values e.g. .001 = 1/10th of a percent.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val` | `number` | Actual percent value |
| `goal` | `number` | Goal percent value |
| `options`? | [`PercentEdgeOptions`](../interfaces/PercentEdgeOptions.md) | Override options passed to percentWithEdge, supports same parameters |

## Returns

`string`

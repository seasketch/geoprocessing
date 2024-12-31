# packMetrics()

```ts
function packMetrics(inMetrics): MetricPack;
```

Converts Metric array to a new MetricPack.
Assumes metric dimensions are consistent for each element in the array, and null values are used

## Parameters

| Parameter   | Type       |
| ----------- | ---------- |
| `inMetrics` | `object`[] |

## Returns

[`MetricPack`](../interfaces/MetricPack.md)

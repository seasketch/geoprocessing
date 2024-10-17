# firstMatchingMetric()

```ts
function firstMatchingMetric<M>(metrics, metricFilter): M
```

Returns the first metric that returns true for metricFilter

## Type Parameters

| Type Parameter |
| ------ |
| `M` *extends* `object` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `metrics` | `M`[] |
| `metricFilter` | (`metric`) => `boolean` |

## Returns

`M`

# toPercentMetric()

```ts
function toPercentMetric(numerators, denominators, options): object[];
```

Matches numerator metrics with denominator metrics and divides their value,
returning a new array of percent metrics. If denominator metric has value of 0, returns NaN
Matches on the optional idProperty given, otherwise defaulting to classId
Deep copies and maintains all other properties from the numerator metric

## Parameters

| Parameter                   | Type       | Description                                                                  |
| --------------------------- | ---------- | ---------------------------------------------------------------------------- |
| `numerators`                | `object`[] | array of metrics, to be used as numerators (often sketch metrics)            |
| `denominators`              | `object`[] | array of metrics, to be used as denominators (often planning region metrics) |
| `options`                   | `object`   | -                                                                            |
| `options.debug`?            | `boolean`  | -                                                                            |
| `options.idProperty`?       | `string`   | -                                                                            |
| `options.metricIdOverride`? | `string`   | -                                                                            |

## Returns

`object`[]

Metric[] of percent values

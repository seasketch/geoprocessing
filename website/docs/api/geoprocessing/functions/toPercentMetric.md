# toPercentMetric()

```ts
function toPercentMetric(
   numerators, 
   denominators, 
   options): object[]
```

Matches numerator metrics with denominator metrics and divides their value,
returning a new array of percent metrics.
Matches on the optional idProperty given, otherwise defaulting to classId
Deep copies and maintains all other properties from the numerator metric
If denominator metric has value of 0, returns NaN
  NaN allows downstream consumers to understand this isn't just any 0.
  It's an opportunity to tell the user that no matter where they put their sketch, there is no way for the value to be more than zero.
  For example, the ClassTable component looks for `NaN` metric values and will automatically display 0%,
  along with an informative popover explaining that no data class features are within the current geography.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `numerators` | `object`[] | array of metrics, to be used as numerators (often sketch metrics) |
| `denominators` | `object`[] | array of metrics, to be used as denominators (often planning region metrics) |
| `options` | `object` | - |
| `options.debug`? | `boolean` | - |
| `options.idProperty`? | `string` | - |
| `options.metricIdOverride`? | `string` | - |

## Returns

`object`[]

Metric[] of percent values or NaN if denominator was 0

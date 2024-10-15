# findAndUpdateMetricValue()

```ts
function findAndUpdateMetricValue<T>(sketchMetrics, matcher, value): T[];
```

Returns new sketchMetrics array with first sketchMetric matched set with new value.
If no match, returns copy of sketchMetrics. Does not mutate array in place.

## Type Parameters

| Type Parameter         |
| ---------------------- |
| `T` _extends_ `object` |

## Parameters

| Parameter       | Type                |
| --------------- | ------------------- |
| `sketchMetrics` | `T`[]               |
| `matcher`       | (`sk`) => `boolean` |
| `value`         | `number`            |

## Returns

`T`[]

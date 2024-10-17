# Metric

```ts
type Metric: z.infer<typeof metricSchema>;
```

Represents a single record of a metric with a value, stratified by one or more dimensions.
The naming is a bit of a misnomer, you can think of it as a MetricValue

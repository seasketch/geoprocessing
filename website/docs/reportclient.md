# Report Client

## Edge Cases

### Zero Geography - No Overlap With MetricGroup (NaN)

This use case happens when no features for some class of data within a datasource, overlap with a geography. This produces a zero (0) value metric in precalc. If this zero value metric gets passed as the denominator to `toPercentMetric(numeratorMetrics, denominatorMetrics)`, the function will return a `NaN` value, rather than 0. This is so that downstream consumers can understand this isn't just any 0. There's an opportunity to tell the user that no matter where they put their sketch within the geography, there is no way for the value to be more than zero. For example, the ClassTable component looks for `NaN` metric values and will automatically display 0%, along with an informative popover explaining that no data class features are within the current geography.

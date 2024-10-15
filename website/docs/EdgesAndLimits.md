---
slug: "/limits"
---

# Edge Cases & Limits

## Zero Geography - No Overlap With MetricGroup (NaN)

This use case happens when no features for some class of data within a datasource, overlap with a geography. This produces a zero (0) value metric in precalc. If this zero value metric gets passed as the denominator to `toPercentMetric(numeratorMetrics, denominatorMetrics)`, the function will return a `NaN` value, rather than 0. This is so that downstream consumers can understand this isn't just any 0. There's an opportunity to tell the user that no matter where they put their sketch within the geography, there is no way for the value to be more than zero. For example, the ClassTable component looks for `NaN` metric values and will automatically display 0%, along with an informative popover explaining that no data class features are within the current geography.

## Zero Geometries

In geoprocessing functions, sketches are clipped to the current geography using `clipToGeography()`. A georaphy can be as large as the extent of the entire world, or be a smaller boundary within the overall planning area.

When the geography is a subset of the larger planning area, you can have sketches that fall completely outside the geography, and the intersection of the sketch and the geography will have nothing remaining because there's no overlap. In GeoJSON, this clip result could be represented with a `null` geometry value, but Turf and most other libraries don't handle null geometries well, so `overlap` toolbox functions would have unexpected results.

We could also have clipToGeography return a `null` value for the entire sketch, but that gets complex, especially when you're processing a whole SketchCollection. What we decided to do instead is to have `clipToGeography` return a `zero` geometry when a sketch has no overlap with the geography. We do this using the `zeroSketch` helper function.Given a Sketch it replaces the geometry with a polygon at [[0,0], [0,0], [0,0], [0,0]]. It's a valid geometry, but's it's located at [Null Island](https://en.wikipedia.org/wiki/Null_Island). What happens as a result is that downstream `overlap` toolbox functions receive a Sketch as they expect, but when they pass it to any overlap functions it will return zero value metrics, as long as Null Island is not withing the planning area.

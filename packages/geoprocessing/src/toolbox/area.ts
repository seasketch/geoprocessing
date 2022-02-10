import { Sketch, SketchCollection, Polygon, Metric } from "../types";
import { isSketchCollection, clip } from "../helpers";
import { createMetric } from "../metrics";
import { featureCollection } from "@turf/helpers";
import { featureEach } from "@turf/meta";
import turfArea from "@turf/area";

/**
 * Calculates the area of each sketch and collection.
 */
export async function area(
  /** single sketch or collection. */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  options: {
    /** Optional metric identifier, defaults to 'area' */
    metricId?: string;
    /** If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true */
    includeChildMetrics?: boolean;
    /** If collection, includes metrics with percent of total area for each sketch , in addition to raw area value metrics, defaults to false */
    includePercMetric?: boolean;
  } = {}
): Promise<Metric[]> {
  const {
    metricId = "area",
    includeChildMetrics = true,
    includePercMetric = false,
  } = options;
  const percMetricId = `${metricId}Perc`;

  // if collection - union to remove overlap
  const isCollection = isSketchCollection(sketch);
  const combinedSketch = isCollection
    ? clip(sketch, "union")
    : featureCollection([sketch]);

  if (!combinedSketch) throw new Error("Invalid sketch");
  const combinedSketchArea = turfArea(combinedSketch);

  const sketchMetrics: Metric[] = [];
  if (sketch) {
    featureEach(sketch, (curSketch) => {
      if (!curSketch || !curSketch.properties) {
        console.log(
          "Warning: feature or its properties are undefined, skipped"
        );
      } else if (!curSketch.geometry) {
        console.log(
          `Warning: feature is missing geometry, zeroed: sketchId:${curSketch.properties.id}, name:${curSketch.properties.name}`
        );

        sketchMetrics.push(
          createMetric({
            metricId,
            sketchId: curSketch.properties.id,
            value: 0,
            extra: {
              sketchName: curSketch.properties.name,
            },
          })
        );
        if (includePercMetric) {
          sketchMetrics.push(
            createMetric({
              metricId: percMetricId,
              sketchId: curSketch.properties.id,
              value: 0,
              extra: {
                sketchName: curSketch.properties.name,
              },
            })
          );
        }
      } else {
        const sketchArea = turfArea(curSketch);
        sketchMetrics.push(
          createMetric({
            metricId,
            sketchId: curSketch.properties.id,
            value: sketchArea,
            extra: {
              sketchName: curSketch.properties.name,
            },
          })
        );
        if (includePercMetric && isCollection) {
          sketchMetrics.push(
            createMetric({
              metricId: percMetricId,
              sketchId: curSketch.properties.id,
              value: sketchArea / combinedSketchArea,
              extra: {
                sketchName: curSketch.properties.name,
              },
            })
          );
        }
      }
    });
  }

  const collMetrics: Metric[] = [];
  if (isCollection) {
    collMetrics.push(
      createMetric({
        metricId,
        sketchId: sketch.properties.id,
        value: combinedSketchArea,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      })
    );
  }

  return [...(includeChildMetrics ? sketchMetrics : []), ...collMetrics];
}

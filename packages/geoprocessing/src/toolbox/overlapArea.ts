import {
  Sketch,
  SketchCollection,
  Feature,
  MultiPolygon,
  Polygon,
  Metric,
} from "../types";
import { isSketchCollection, toSketchArray, clip } from "../helpers";
import { createMetric } from "../metrics";
import { featureCollection } from "@turf/helpers";
import { featureEach } from "@turf/meta";
import turfArea from "@turf/area";

/**
 * Assuming sketches are within some outer boundary with size outerArea,
 * calculates the area of each sketch and the proportion of outerArea they take up.
 */
export async function overlapArea(
  /** Metric identifier */
  metricId: string,
  /** single sketch or collection. */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  /** area of outer boundary (typically EEZ or planning area) */
  outerArea: number,
  options: {
    /** If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true */
    includeChildMetrics?: boolean;
    /** Includes metrics with percent of total area, in addition to raw area value metrics, defaults to true */
    includePercMetric?: boolean;
  } = {}
): Promise<Metric[]> {
  const { includePercMetric = true, includeChildMetrics = true } = options;
  const percMetricId = `${metricId}Perc`;
  // Union to remove overlap
  const combinedSketch = isSketchCollection(sketch)
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
        if (includePercMetric) {
          sketchMetrics.push(
            createMetric({
              metricId: percMetricId,
              sketchId: curSketch.properties.id,
              value: sketchArea / outerArea,
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
  if (isSketchCollection(sketch)) {
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
    if (includePercMetric) {
      collMetrics.push(
        createMetric({
          metricId: percMetricId,
          sketchId: sketch.properties.id,
          value: combinedSketchArea / outerArea,
          extra: {
            sketchName: sketch.properties.name,
            isCollection: true,
          },
        })
      );
    }
  }

  return [...(includeChildMetrics ? sketchMetrics : []), ...collMetrics];
}

/**
 * Returns area stats for sketch input after performing overlay operation against a subarea feature.
 * Includes both area overlap and percent area overlap metrics, because calculating percent later would be too complicated
 * For sketch collections, dissolve is used when calculating total sketch area to prevent double counting
 */
export async function overlapSubarea(
  /** Metric identifier */
  metricId: string,
  /** Single sketch or collection */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  /** subarea feature */
  subareaFeature: Feature<Polygon | MultiPolygon>,
  options?: {
    /** operation to perform on sketch in relation to sub area features, defaults to 'intersection' */
    operation?: "intersection" | "difference";
    /** area of outer boundary.  Use for total area of the subarea for intersection when you don't have the whole feature, or use for the total area of the boundar outside of the subarea for difference (typically EEZ or planning area) */
    outerArea?: number | undefined;
  }
): Promise<Metric[]> {
  const percMetricId = `${metricId}Perc`;
  const operation = options?.operation || "intersection";
  const subareaArea =
    options?.outerArea && operation === "intersection"
      ? options?.outerArea
      : turfArea(subareaFeature);
  const sketches = toSketchArray(sketch);

  if (operation === "difference" && !options?.outerArea)
    throw new Error(
      "Missing outerArea which is required when operation is difference"
    );

  // Run op and keep null remainders for reporting purposes
  const subsketches = (() => {
    return sketches.map((sketch) =>
      clip(featureCollection([sketch, subareaFeature]), operation)
    );
  })();

  // calculate area of all subsketches
  const subsketchArea = (() => {
    // Remove null
    const allSubsketches = subsketches.reduce<
      Feature<Polygon | MultiPolygon>[]
    >(
      (subsketches, subsketch) =>
        subsketch ? [...subsketches, subsketch] : subsketches,
      []
    );
    // Remove overlap
    const combinedSketch =
      allSubsketches.length > 0
        ? clip(featureCollection(allSubsketches), "union")
        : featureCollection(allSubsketches);

    return allSubsketches && combinedSketch ? turfArea(combinedSketch) : 0;
  })();

  // Choose inner or outer subarea for calculating percentage
  const operationArea = (() => {
    if (operation === "difference" && options?.outerArea) {
      return options?.outerArea - subareaArea;
    } else {
      return subareaArea;
    }
  })();

  let metrics: Metric[] = [];
  if (subsketches) {
    subsketches.forEach((feat, index) => {
      const origSketch = sketches[index];
      if (feat) {
        const subsketchArea = turfArea(feat);
        metrics.push(
          createMetric({
            metricId,
            sketchId: origSketch.properties.id,
            value: subsketchArea,
            extra: {
              sketchName: origSketch.properties.name,
            },
          })
        );
        metrics.push(
          createMetric({
            metricId: percMetricId,
            sketchId: origSketch.properties.id,
            value: subsketchArea === 0 ? 0 : subsketchArea / operationArea,
            extra: {
              sketchName: origSketch.properties.name,
            },
          })
        );
      } else {
        metrics.push(
          createMetric({
            metricId,
            sketchId: origSketch.properties.id,
            value: 0,
            extra: {
              sketchName: origSketch.properties.name,
            },
          })
        );
        metrics.push(
          createMetric({
            metricId: percMetricId,
            sketchId: origSketch.properties.id,
            value: 0,
            extra: {
              sketchName: origSketch.properties.name,
            },
          })
        );
      }
    });
  }

  if (isSketchCollection(sketch)) {
    metrics.push(
      createMetric({
        metricId,
        sketchId: sketch.properties.id,
        value: subsketchArea,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      })
    );
    metrics.push(
      createMetric({
        metricId: percMetricId,
        sketchId: sketch.properties.id,
        value: subsketchArea === 0 ? 0 : subsketchArea / operationArea,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      })
    );
  }

  return metrics;
}

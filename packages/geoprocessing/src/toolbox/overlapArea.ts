import {
  Sketch,
  SketchCollection,
  Feature,
  MultiPolygon,
  Polygon,
  Metric,
} from "../types/index.js";
import { isSketchCollection, toSketchArray } from "../helpers/index.js";
import { createMetric } from "../metrics/index.js";
import {
  featureCollection,
  featureEach,
  area as turfArea,
  simplify,
} from "@turf/turf";
import { ValidationError } from "../types/index.js";
import { clip } from "./clip.js";

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
    /** simplify sketches with tolerance in degrees. .000001 is a good first value to try. only used for calculating area of collection (avoiding clip union to remove overlap blowing up) */
    simplifyTolerance?: number;
  } = {},
): Promise<Metric[]> {
  if (!sketch) throw new ValidationError("Missing sketch");
  const { includePercMetric = true, includeChildMetrics = true } = options;
  const percMetricId = `${metricId}Perc`;
  const collectionExtra: Metric["extra"] = {};

  // Remove overlap
  const combinedSketchArea = (() => {
    let sketches = toSketchArray(sketch);
    try {
      // Simplify if enabled
      if (options?.simplifyTolerance)
        sketches = simplify(featureCollection(sketches), {
          tolerance: options.simplifyTolerance,
          highQuality: true,
        }).features;

      const combinedSketch = clip(featureCollection(sketches), "union");
      return combinedSketch ? turfArea(combinedSketch) : 0;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("Unable to complete output ring")
      ) {
        // Fallback to simplify
        const tolerance = options?.simplifyTolerance || 0.000_001;
        const combinedSketch = clip(
          simplify(featureCollection(sketches), {
            tolerance,
            highQuality: true,
          }),
          "union",
        );
        collectionExtra.simplifyTolerance = tolerance;
        return combinedSketch ? turfArea(combinedSketch) : 0;
      } else {
        // Return zero to return something and flag error
        collectionExtra.error = true;
        console.error(error);
        console.log("Returning zero area with error flagged");
        return 0;
      }
    }
  })();

  const sketchMetrics: Metric[] = [];
  if (sketch) {
    featureEach(sketch, (curSketch) => {
      if (!curSketch || !curSketch.properties) {
        console.log(
          "Warning: feature or its properties are undefined, skipped",
        );
      } else if (curSketch.geometry) {
        const sketchArea = turfArea(curSketch);
        sketchMetrics.push(
          createMetric({
            metricId,
            sketchId: curSketch.properties.id,
            value: sketchArea,
            extra: {
              sketchName: curSketch.properties.name,
            },
          }),
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
            }),
          );
        }
      } else {
        console.log(
          `Warning: feature is missing geometry, zeroed: sketchId:${curSketch.properties.id}, name:${curSketch.properties.name}`,
        );

        sketchMetrics.push(
          createMetric({
            metricId,
            sketchId: curSketch.properties.id,
            value: 0,
            extra: {
              sketchName: curSketch.properties.name,
            },
          }),
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
            }),
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
      }),
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
        }),
      );
    }
  }

  return [...(includeChildMetrics ? sketchMetrics : []), ...collMetrics];
}

/**
 * Returns area stats for sketch input after performing overlay operation against a subarea feature.
 * Includes both area overlap and percent area overlap metrics, because calculating percent later would be too complicated
 * For sketch collections, dissolve is used when calculating total sketch area to prevent double counting
 * @deprecated - using geographies will clip your datasources and you can just use overlapFeatures.  This will be removed in a future version
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
    /** simplify sketches with tolerance in degrees. .000001 is a good first value to try. only used for calculating area of collection (avoiding clip union to remove overlap blowing up) */
    simplifyTolerance?: number;
  },
): Promise<Metric[]> {
  if (!sketch) throw new ValidationError("Missing sketch");
  const percMetricId = `${metricId}Perc`;
  const operation = options?.operation || "intersection";
  const collectionExtra: Metric["extra"] = {};
  const subareaArea =
    options?.outerArea && operation === "intersection"
      ? options?.outerArea
      : subareaFeature
        ? turfArea(subareaFeature)
        : 0;
  const sketches = toSketchArray(sketch);

  if (operation === "difference" && !options?.outerArea)
    throw new ValidationError(
      "Missing outerArea which is required when operation is difference",
    );

  // Run op and keep null remainders for reporting purposes
  const subsketches = (() => {
    return sketches.map((sketch) =>
      subareaFeature
        ? clip(featureCollection([sketch, subareaFeature]), operation)
        : null,
    );
  })();

  // calculate area of all subsketches
  const subsketchArea = (() => {
    // Remove null
    let allSubsketches = subsketches.reduce<Feature<Polygon | MultiPolygon>[]>(
      (subsketches, subsketch) =>
        subsketch ? [...subsketches, subsketch] : subsketches,
      [],
    );

    // Remove overlap
    try {
      // Simplify if enabled
      if (options?.simplifyTolerance)
        allSubsketches = simplify(featureCollection(allSubsketches), {
          tolerance: options.simplifyTolerance,
          highQuality: true,
        }).features;

      const combinedSketch =
        allSubsketches.length > 0
          ? clip(featureCollection(allSubsketches), "union")
          : featureCollection(allSubsketches);
      return allSubsketches && combinedSketch ? turfArea(combinedSketch) : 0;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("Unable to complete output ring")
      ) {
        // Fallback to simplify
        const tolerance = options?.simplifyTolerance || 0.000_001;
        const combinedSketch = clip(
          simplify(featureCollection(allSubsketches), {
            tolerance,
            highQuality: true,
          }),
          "union",
        );
        collectionExtra.simplifyTolerance = tolerance;
        return combinedSketch ? turfArea(combinedSketch) : 0;
      } else {
        // Return zero to return something and flag error
        collectionExtra.error = true;
        console.error(error);
        console.log("Returning zero area with error flagged");
        return 0;
      }
    }
  })();

  // Choose inner or outer subarea for calculating percentage
  const operationArea = (() => {
    return operation === "difference" && options?.outerArea
      ? options?.outerArea - subareaArea
      : subareaArea;
  })();

  const metrics: Metric[] = [];
  if (subsketches) {
    for (const [index, feat] of subsketches.entries()) {
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
          }),
        );
        metrics.push(
          createMetric({
            metricId: percMetricId,
            sketchId: origSketch.properties.id,
            value: subsketchArea === 0 ? 0 : subsketchArea / operationArea,
            extra: {
              sketchName: origSketch.properties.name,
            },
          }),
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
          }),
        );
        metrics.push(
          createMetric({
            metricId: percMetricId,
            sketchId: origSketch.properties.id,
            value: 0,
            extra: {
              sketchName: origSketch.properties.name,
            },
          }),
        );
      }
    }
  }

  if (isSketchCollection(sketch)) {
    metrics.push(
      createMetric({
        metricId,
        sketchId: sketch.properties.id,
        value: subsketchArea,
        extra: {
          ...collectionExtra,
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      }),
    );
    metrics.push(
      createMetric({
        metricId: percMetricId,
        sketchId: sketch.properties.id,
        value: subsketchArea === 0 ? 0 : subsketchArea / operationArea,
        extra: {
          ...collectionExtra,
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      }),
    );
  }

  return metrics;
}

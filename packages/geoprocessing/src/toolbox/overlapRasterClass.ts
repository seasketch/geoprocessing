import { Polygon, Sketch, SketchCollection, Georaster, Metric } from "../types";
import { isSketchCollection } from "../helpers";
import { createMetric } from "../metrics";
import { MultiPolygon } from "@turf/helpers";
import { Histogram } from "../types/georaster";
import { getHistogram } from "./geoblaze";
import { featureEach } from "@turf/meta";

/**
 * Calculates sum of overlap between sketches and raster feature classes
 * If sketch collection, then calculate overlap for all child sketches also
 * TODO: make id user-definable and default to classId
 */
export async function overlapRasterClass(
  /** metricId value to assign to each measurement */
  metricId: string,
  /** Cloud-optimized geotiffto, loaded via geoblaze.parse(), representing categorical data (multiple classes) */
  raster: Georaster,
  /**
   * single sketch or collection.  If undefined will return sum by feature class for the whole raster.
   * Supports polygon or multipolygon.  Will remove overlap between sketches, but will not remove overlap within Multipolygon sketch
   */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | undefined,
  /** Object mapping numeric (categorical) class IDs (as strings e.g. "1") in the raster to their string names for display e.g. "Coral Reef" */
  classIdMapping: Record<string, string>
): Promise<Metric[]> {
  if (!classIdMapping) throw new Error("Missing classIdMapping");

  // Get histogram for each feature, whether sketch or sketch collection
  const histoPromises: Promise<Histogram>[] = [];
  const histoFeatures: Sketch[] = [];
  // await results and create metrics for each sketch
  let sketchMetrics: Metric[] = [];

  if (sketch) {
    featureEach(sketch, async (feat) => {
      // accumulate geoblaze promises and features so we can create metrics later
      histoPromises.push(getHistogram(raster, feat));
      histoFeatures.push(feat);
    });

    (await Promise.all(histoPromises)).forEach((curHisto, index) => {
      const histoMetrics = histoToMetrics(
        metricId,
        histoFeatures[index],
        curHisto,
        classIdMapping
      );
      sketchMetrics.push(...histoMetrics);
    });
  }

  // Calculate overall if sketch collection or no sketch
  if (!sketch || isSketchCollection(sketch)) {
    const overallHisto = await getHistogram(raster, sketch);
    const overallHistoMetrics = histoToMetrics(
      metricId,
      sketch,
      overallHisto,
      classIdMapping
    );
    sketchMetrics.push(...overallHistoMetrics);
  }

  return sketchMetrics;
}

/** Returns metrics given histogram and sketch */
const histoToMetrics = (
  metricId: string,
  sketch: Sketch | SketchCollection | undefined,
  histo: Histogram,
  /** Object mapping numeric class IDs to their string counterpart */
  classIdMapping: Record<string, string>
): Metric[] => {
  const metrics: Metric[] = [];
  const numericClassIds = Object.keys(classIdMapping);
  // Initialize complete histogram with zeros
  const finalHisto = Object.keys(classIdMapping).reduce(
    (histoSoFar, curClassId) => ({ ...histoSoFar, [curClassId]: 0 }),
    {}
  );
  // Merge in calculated histogram which will only include non-zero
  if (histo) {
    Object.keys(histo).forEach((classId) => {
      finalHisto[classId] = histo[classId];
    });
  }

  // Create one metric record per class
  numericClassIds.forEach((numericClassId) => {
    metrics.push(
      createMetric({
        metricId,
        classId: classIdMapping[numericClassId],
        sketchId: sketch ? sketch.properties.id : null,
        value: histo[numericClassId] || 0, // should never be undefined but default to 0 anyway
        extra: sketch
          ? {
              sketchName: sketch.properties.name,
              ...(isSketchCollection(sketch) ? { isCollection: true } : {}),
            }
          : {},
      })
    );
  });
  return metrics;
};

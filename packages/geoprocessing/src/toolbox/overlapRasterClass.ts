import { Polygon, Sketch, SketchCollection, Georaster, Metric } from "../types";
import {
  toSketchArray,
  isSketchCollection,
  clip,
  removeSketchPolygonHoles,
  removeSketchCollPolygonHoles,
} from "../helpers";
import { createMetric } from "../metrics";
import flatten from "@turf/flatten";
import area from "@turf/area";
import { Feature, featureCollection, MultiPolygon } from "@turf/helpers";
// @ts-ignore
import geoblaze from "geoblaze";
import { Histogram } from "../types/georaster";

/**
 * Calculates sum of overlap between sketches and feature classes in raster
 * Includes overall and per sketch for each class
 */
export async function overlapRasterClass(
  metricId: string,
  /** raster to search */
  raster: Georaster,
  /**
   * single sketch or collection.  If undefined will return sum by feature class for the whole raster.
   * Supports polygon or multipolygon.  Will remove overlap between sketches, but will not remove overlap within Multipolygon sketch
   */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | null,
  /** Object mapping numeric class IDs to their string counterpart */
  classIdMapping: Record<string, string>,
  options: {
    /** Whether to remove holes from sketch polygons. Geoblaze can overcount with them. Default to true */
    removeSketchHoles?: boolean;
  } = { removeSketchHoles: true }
): Promise<Metric[]> {
  if (!classIdMapping) throw new Error("Missing classIdMapping");
  const sketches = sketch ? toSketchArray(sketch) : [];
  const sketchArea = sketch ? area(sketch) : 0;
  const numericClassIds = Object.keys(classIdMapping);

  // overallHistograms account for sketch overlap, sketchHistograms do not
  // histogram will exclude a class in result if not in raster, rather than return zero
  // histogram will be undefined if no raster cells are found within sketch feature
  const { sketchHistograms, overallHistograms } = (() => {
    let overallHistograms: Histogram[] = [];
    let sketchHistograms: Histogram[] = [];
    if (sketch) {
      // Get histogram for each feature
      // If feature overlap, remove with union
      // Optionally remove polygon holes (geoblaze polygon hole bug)
      // Then get the histogram for each sketch
      // If multipolygon sketch, geoblaze does not support, so break down into polygons, then sum the result

      const holeSketches = (() => {
        if (options.removeSketchHoles) {
          if (isSketchCollection(sketch)) {
            return removeSketchCollPolygonHoles(sketch);
          } else {
            return [removeSketchPolygonHoles(sketch)];
          }
        }
        return sketches;
      })();

      const sketchUnion = clip(featureCollection(holeSketches), "union");
      if (!sketchUnion)
        throw new Error(`rasterClassStats ${metricId} - something went wrong`);
      const sketchUnionArea = area(sketchUnion);
      const isOverlap = sketchUnionArea < sketchArea;

      const clippedSketches = isOverlap
        ? flatten(sketchUnion).features
        : sketches.reduce<Feature<Polygon>[]>((soFar, sk) => {
            const skPolyFC = flatten(sk);
            return soFar.concat(skPolyFC.features); // handles poly and multipoly
          }, []);

      // Get count of unique cell IDs in each feature
      overallHistograms = clippedSketches.map((feature) => {
        return geoblaze.histogram(raster, feature, {
          scaleType: "nominal",
        })[0] as Histogram;
      });

      // For each sketch
      sketchHistograms = sketches.map((feature) => {
        // consolidate to polys array - handling both poly and multipoly
        const polys = flatten(feature).features;

        // get histogram for each poly
        const polyHistograms = polys.map((poly) => {
          const histo = geoblaze.histogram(raster, poly, {
            scaleType: "nominal",
          })[0] as Histogram;

          // Create zeroed poly histogram, one key per class and merge in the non-zero histogram values
          const polyHisto = Object.keys(classIdMapping).reduce(
            (histoSoFar, curClassId) => ({ ...histoSoFar, [curClassId]: 0 }),
            {}
          );
          if (histo) {
            Object.keys(histo).forEach((classId) => {
              polyHisto[classId] = histo[classId];
            });
          }

          return polyHisto;
        });

        // Now sum polygon histos into one sketch histo by class ID.
        const sketchHisto = polyHistograms[0]; // seed with first polygon histo

        // If sketch is multipolygon, add in the other poly histos
        if (polyHistograms.length > 1) {
          polyHistograms.slice(1).forEach((polyHisto) => {
            Object.keys(polyHisto).forEach((classId) => {
              sketchHisto[classId] += polyHisto[classId];
            });
          });
        }
        return sketchHisto;
      });
    } else {
      // Get histogram for whole raster
      const hist = geoblaze.histogram(raster, undefined, {
        scaleType: "nominal",
      })[0] as Histogram;
      // If there are no sketches, then they are the same
      overallHistograms = [hist];
      sketchHistograms = [hist];
    }

    return {
      sketchHistograms,
      overallHistograms,
    };
  })();

  let metrics: Metric[] = [];

  if (sketches && sketches.length > 0) {
    sketchHistograms.forEach((sketchHist, index) => {
      numericClassIds.forEach((numericClassId) => {
        metrics.push(
          createMetric({
            metricId,
            classId: classIdMapping[numericClassId],
            sketchId: sketches[index].properties.id,
            value: sketchHist[numericClassId] || 0, // should never be undefined but default to 0 anyway
            extra: {
              sketchName: sketches[index].properties.name,
            },
          })
        );
      });
    });
  }

  if (!sketch || isSketchCollection(sketch)) {
    // Sum the overallHistograms into one
    const sumByClass: Record<string, number> = {};
    overallHistograms.forEach((overallHist) => {
      if (!overallHist) {
        return; // skip undefined result
      }
      numericClassIds.forEach((classId) => {
        const value = overallHist[classId] ? overallHist[classId] : 0;
        sumByClass[classId] = sumByClass[classId]
          ? sumByClass[classId] + value
          : value;
      });
    });

    // Transform to metrics
    numericClassIds.forEach((classId) => {
      const newMetric = createMetric({
        metricId,
        classId: classIdMapping[classId],
        sketchId: sketch ? sketch.properties.id : null,
        value: sumByClass[classId] || 0, // should never be undefined but default to 0 anyway
      });
      if (sketch && isSketchCollection(sketch)) {
        newMetric.extra = {
          sketchName: sketch.properties.name,
          isCollection: true,
        };
      }
      metrics.push(newMetric);
    });
  }

  return metrics;
}

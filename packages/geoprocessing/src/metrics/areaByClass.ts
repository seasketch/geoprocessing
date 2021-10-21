import {
  intersect,
  Polygon,
  MultiPolygon,
  Feature,
  FeatureCollection,
  roundDecimal,
  BBox,
  RasterDatasourceMeta,
  ClassDatasourceMeta,
  loadCogWindow,
} from "..";
import { Georaster } from "../types/georaster";
import logger from "../util/logger";

// @ts-ignore
import geoblaze from "geoblaze";
import area from "@turf/area";
import combine from "@turf/combine";

/**
 * returns area of overlapping features by class.  Class-based features are fetched
 * from flatgeobuf datasource.
 */
export async function areaOverlapByClassVector(
  /** collection of features to intersect and get area overlap */
  features: FeatureCollection<Polygon>,
  /** array of features each with one assigned class */
  classFeatures: Feature<Polygon>[],
  /** The feature property containing the class name */
  classProperty: string
) {
  try {
    const featureMulti = (combine(features) as FeatureCollection<MultiPolygon>)
      .features[0];

    // Group features by type up front.  We cannot simply intersect them all in one shot because we will lose the knowledge of which clipped poly has which class
    const featuresByClass = classFeatures.reduce<
      Record<string, Feature<Polygon>[]>
    >((acc, curFeature) => {
      const cProperty =
        (curFeature.properties && curFeature.properties[classProperty]) ||
        "type";
      return {
        ...acc,
        [cProperty]: acc[cProperty]
          ? acc[cProperty].concat(curFeature)
          : [curFeature],
      };
    }, {});

    // Bulk intersect each group, its cheaper for intersects underlying sweepline algorithm to process them all in one pass
    let areaByClass: Record<string, number> = {};
    Object.keys(featuresByClass).map((fbc) => {
      const clippedMultipoly = intersect(featureMulti, featuresByClass[fbc]);
      if (clippedMultipoly) areaByClass[fbc] = area(clippedMultipoly);
    });

    return areaByClass;
  } catch (err: unknown) {
    logger.error("habitat error", err as Error);
    throw err;
  }
}

/**
 * returns area of overlapping features by class.  Class-based features are fetched
 * from COG raster
 */
export async function areaOverlapByClassRaster(
  fc: FeatureCollection<Polygon>,
  box: BBox,
  config: RasterDatasourceMeta & ClassDatasourceMeta
) {
  try {
    const raster = await loadCogWindow(config.rasterUrl, { windowBox: box });
    const areaByClass = await rasterClassStats(raster, config, fc.features);

    return areaByClass;
  } catch (err: unknown) {
    logger.error("habitat error", err as Error);
    throw err;
  }
}

/**
 * Implements the raster-based areaByClass calculation
 */
export async function rasterClassStats(
  /** raster to search */
  raster: Georaster,
  config: RasterDatasourceMeta & ClassDatasourceMeta,
  /** polygons to search */
  features?: Feature<Polygon>[]
): Promise<Record<string, number>> {
  const histograms = (() => {
    if (features) {
      // Get count of unique cell IDs in each feature
      return features.map((feature) => {
        return geoblaze.histogram(raster, feature, {
          scaleType: "nominal",
        })[0];
      });
    } else {
      // Get histogram for whole raster
      return [
        geoblaze.histogram(raster, undefined, {
          scaleType: "nominal",
        })[0],
      ];
    }
  })();

  // Initialize the total counts
  let countByClass = Object.keys(config.classIdToName).reduce<
    Record<string, number>
  >(
    (acc, class_id) => ({
      ...acc,
      [class_id]: 0,
    }),
    {}
  );

  // Sum the total counts
  histograms.forEach((hist) => {
    Object.keys(hist).forEach(
      (class_id) => (countByClass[class_id] += hist[class_id])
    );
  });

  // Calculate area from counts
  const areaByClass: Record<string, number> = Object.keys(countByClass).reduce(
    (acc, class_id) => ({
      ...acc,
      [class_id]: roundDecimal(
        countByClass[class_id] * config.rasterPixelArea,
        6
      ),
    }),
    {}
  );

  return areaByClass;
}

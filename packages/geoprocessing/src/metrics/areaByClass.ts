import {
  intersect,
  Polygon,
  MultiPolygon,
  Feature,
  FeatureCollection,
  roundDecimal,
  BBox,
  ClassFeatureProps,
  VectorDatasourceMeta,
  RasterDatasourceMeta,
  ClassDatasourceMeta,
  loadCogWindow,
  fgbFetchAll,
} from "..";
import { Georaster } from "../types/georaster";
import logger from "../util/logger";

// @ts-ignore
import geoblaze from "geoblaze";
import area from "@turf/area";
import combine from "@turf/combine";
import bbox from "@turf/bbox";

/**
 * returns areaByClass metric calculation.  Class-based features are fetched
 * from flatgeobuf datasource and only the portion within features (e.g. sketch
 * collection) are included in calculation.
 */
export async function areaByClassVector<P extends ClassFeatureProps>(
  /** collection of features each with one assigned class */
  features: FeatureCollection<Polygon>,
  /** The feature property containing the class name */
  className: string,
  config: VectorDatasourceMeta,
  /** bounding fox of the features */
  box?: BBox
) {
  try {
    const featureMulti = (combine(features) as FeatureCollection<MultiPolygon>)
      .features[0];

    // Fetch all features in order to intersect them in groups, much faster than one at a time
    const featuresToIntersect = await fgbFetchAll<Feature<Polygon>>(
      config.vectorUrl,
      box || bbox(features)
    );
    const type = className || "type";
    type VectorFeature = Feature<Polygon>;

    // Group features by type up front.  We cannot simply intersect them all in one shot because we will lose the knowledge of which clipped poly has which class
    const featuresByClass = featuresToIntersect.reduce<
      Record<string, VectorFeature[]>
    >((acc, curFeature) => {
      const className: string = curFeature.properties?.className;
      return {
        ...acc,
        [className]: acc[className]
          ? acc[className].concat(curFeature)
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
 * returns areaByClass metric calculation.  Class-based features are fetched
 * from COG raster and only cells within a feature collection) are included
 * in calculation
 */
export async function areaByClassRaster(
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

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
  fgBoundingBox,
  deserialize,
} from "..";
import { Georaster } from "../types/georaster";
import logger from "../util/logger";

// @ts-ignore
import geoblaze from "geoblaze";
import area from "@turf/area";
import combine from "@turf/combine";

/**
 * returns areaByClass metric calculation.  Class-based features are fetched
 * from flatgeobuf datasource and only the portion within features (e.g. sketch
 * collection) are included in calculation
 */
export async function areaByClassVector<P extends ClassFeatureProps>(
  features: FeatureCollection<Polygon>,
  box: BBox,
  config: VectorDatasourceMeta
) {
  // Intersect polys one at a time as they come over the wire, maintaining properties
  try {
    const featureMulti = (combine(features) as FeatureCollection<MultiPolygon>)
      .features[0];
    const iter = deserialize(config.vectorUrl, fgBoundingBox(box));

    let clippedFeatures: Feature<Polygon, P>[] = [];
    let areaByClass: Record<string, number> = {};
    // @ts-ignore
    for await (const featureToClip of iter) {
      const polyClipped = intersect(featureToClip, featureMulti, {
        properties: featureToClip.properties,
      }) as Feature<Polygon, P>;
      if (polyClipped) {
        clippedFeatures.push(polyClipped);

        // Sum total area by class ID within feature
        const polyArea = area(polyClipped);
        areaByClass[polyClipped.properties.class_id] =
          areaByClass.hasOwnProperty(polyClipped.properties.class_id)
            ? areaByClass[polyClipped.properties.class_id] + polyArea
            : polyArea;
      }
    }

    return areaByClass;
  } catch (err) {
    logger.error("habitat error", err);
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
    const raster = await loadCogWindow(config.rasterUrl, box);
    const areaByClass = await rasterClassStats(raster, config, fc.features);

    return areaByClass;
  } catch (err) {
    logger.error("habitat error", err);
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

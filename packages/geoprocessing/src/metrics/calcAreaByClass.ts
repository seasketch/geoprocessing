import area from "@turf/area";
import {
  FeatureCollection,
  Polygon,
  Feature,
  roundDecimal,
  ClassDatasourceMeta,
} from "..";
import { strict as assert } from "assert";

/**
 * Calculates area stats for a given feature collection.
 * Maintains existing type property for joining with other data
 * Results are rounded to 6 decimal places
 * @param {} collection - a GeoJSON feature collection
 * @param {*} config.classProperty - feature property to stratify by
 * @param {*} config. - feature property to stratify by
 */
export function calcAreaStats(
  collection: FeatureCollection<Polygon>,
  config: ClassDatasourceMeta
) {
  // Sum area by type, single pass
  const areaByClass = collection.features.reduce<{ [key: string]: number }>(
    (progress, feat) => {
      if (!feat || !feat.properties) {
        console.log(
          "Warning: feature has no properties, skipped",
          JSON.stringify(feat)
        );
        return progress;
      }
      if (!feat.geometry) {
        console.log(
          "Warning: feature is missing geometry, skipped",
          JSON.stringify(feat)
        );
        return progress;
      }
      const featArea = area(feat);
      return {
        ...progress,
        [feat.properties[config.classProperty]]:
          feat.properties[config.classProperty] in progress
            ? progress[feat.properties[config.classProperty]] + featArea
            : featArea,
      };
    },
    {}
  );

  const featByType = collection.features.reduce<{
    [key: string]: Feature<Polygon>[];
  }>((progress, feat) => {
    if (!feat || !feat.properties) return progress;
    return {
      ...progress,
      [feat.properties[config.classProperty]]:
        feat.properties[config.classProperty] in progress
          ? progress[feat.properties[config.classProperty]].concat(feat)
          : [feat],
    };
  }, {});

  // Sum total area
  const totalArea = Object.values(areaByClass).reduce(
    (sum, val) => sum + val,
    0
  );

  // Calculate percentage area by type
  const areaStatsByType = Object.keys(areaByClass).map((type, index) => {
    assert(areaByClass[type] >= 0 && areaByClass[type] <= totalArea);
    return {
      [config.classProperty]: type,
      class_id: config.classIdToName ? parseInt(type) : index + 1,
      class: config.classIdToName ? config.classIdToName[type] : type,
      totalArea: roundDecimal(areaByClass[type], 6),
      percArea: roundDecimal(areaByClass[type] / totalArea, 6),
    };
  });

  assert(totalArea && totalArea > 0);

  return {
    totalArea: +totalArea.toFixed(6),
    areaByClass: areaStatsByType,
    areaUnit: "square meters",
  };
}

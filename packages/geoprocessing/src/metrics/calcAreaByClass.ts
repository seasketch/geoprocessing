import area from "@turf/area";
import {
  FeatureCollection,
  Polygon,
  Feature,
  roundDecimal,
  FunctionMeta,
  ClassDatasourceMeta,
} from "..";
import { strict as assert } from "assert";

/**
 * Calculates area stats for a given feature collection.
 * Results are rounded to 6 decimal places
 * @param {} collection - a GeoJSON feature collection
 * @param {*} typeProperty - feature property to stratify by
 */
export function calcAreaStats(
  collection: FeatureCollection<Polygon>,
  config: FunctionMeta & ClassDatasourceMeta
) {
  // Sum area by type, single pass
  const areaByClass = collection.features.reduce<{ [key: string]: number }>(
    (progress, feat) => {
      const featArea = area(feat);
      if (!feat || !feat.properties) return progress;
      return {
        ...progress,
        [feat.properties.class_id]:
          feat.properties.class_id in progress
            ? progress[feat.properties.class_id] + featArea
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
      [feat.properties.class_id]:
        feat.properties.class_id in progress
          ? progress[feat.properties.class_id].concat(feat)
          : [feat],
    };
  }, {});

  // Sum total area
  const totalArea = Object.values(areaByClass).reduce(
    (sum, val) => sum + val,
    0
  );

  // Calculate percentage area by type
  const areaStatsByType = Object.keys(areaByClass).map((type) => {
    assert(areaByClass[type] >= 0 && areaByClass[type] <= totalArea);
    return {
      class_id: parseInt(type),
      class: config.classIdToName[type],
      totalArea: roundDecimal(areaByClass[type], 6),
      percArea: roundDecimal(areaByClass[type] / totalArea, 6),
    };
  });

  assert(totalArea && totalArea > 0);

  return {
    totalArea: +totalArea.toFixed(6),
    areaByClass: areaStatsByType,
    areaUnit: config.areaUnits,
  };
}

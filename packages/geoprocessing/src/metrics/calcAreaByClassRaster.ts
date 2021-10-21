import {
  FeatureCollection,
  Polygon,
  FunctionMeta,
  ClassDatasourceMeta,
  RasterDatasourceMeta,
  Georaster,
  roundDecimal,
} from "..";
import { rasterClassStats } from "./areaByClass";
import { strict as assert } from "assert";

/**
 * Calculates area of all classes for a given raster
 * Results are rounded to 6 decimal places (THIS IS NOT YET WORKING PROPERLY)
 * @param {} raster - raster with categorical data
 * @param {*} typeProperty - feature property to stratify by
 * @param {string} idField -
 */
export async function calcAreaStatsRaster(
  raster: Georaster,
  config: FunctionMeta & ClassDatasourceMeta & RasterDatasourceMeta
) {
  const areaByClass = await rasterClassStats(raster, config);

  // TODO: refactor shared code with calcAreaStats

  // Sum total area
  const totalArea = Object.values(areaByClass).reduce(
    (sum, val) => sum + val,
    0
  );

  // Calculate percentage area by type
  const areaStatsByType = Object.keys(areaByClass).map((type, index) => {
    const area = areaByClass[type];
    assert(area >= 0 && area <= totalArea);
    return {
      class_id: config.classIdToName ? parseInt(type) : index,
      class: config.classIdToName ? config.classIdToName[type] : type,
      totalArea: roundDecimal(area, 6),
      percArea:
        area === 0 || totalArea === 0 ? 0 : roundDecimal(area / totalArea, 6),
    };
  });

  assert(totalArea >= 0);

  return {
    totalArea: +totalArea.toFixed(6),
    areaByClass: areaStatsByType,
    areaUnit: config.areaUnits,
  };
}

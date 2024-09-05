import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  splitSketchAntimeridian,
  rasterStats,
} from "@seasketch/geoprocessing";
import { bbox, area as turfArea } from "@turf/turf";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";
import { getFeatures, loadCog } from "@seasketch/geoprocessing/dataproviders";

export interface SimpleResults {
  /** area of sketch within geography in square meters */
  area: number;
  /** list of ecoregions within bounding box of sketch  */
  nearbyEcoregions: string[];
  /** minimum surface temperature within sketch */
  minTemp: number;
  /** maximum surface temperature within sketch */
  maxTemp: number;
}

async function simpleFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<SimpleResults> {
  // Use caller-provided geographyId if provided
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  // Get geography features, falling back to geography assigned to default-boundary group
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  // Support sketches crossing antimeridian
  const splitSketch = splitSketchAntimeridian(sketch);
  // Clip to portion of sketch within current geography
  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  // Vector example - create list of country EEZ's nearby to the sketch (overlapping with sketch bounding box)

  // Fetch eez features overlapping sketch bbox
  const ds = project.getExternalVectorDatasourceById("meow-ecos");
  const url = project.getDatasourceUrl(ds);
  const eezFeatures = await getFeatures(ds, url, {
    bbox: clippedSketch.bbox || bbox(clippedSketch),
  });

  // Reduce to list of ecoregion names
  const regionNames = eezFeatures.reduce<Record<string, string>>(
    (regionsSoFar, curFeat) => {
      if (curFeat.properties && ds.idProperty) {
        const regionName = curFeat.properties[ds.idProperty];
        return { ...regionsSoFar, [regionName]: regionName };
      } else {
        return { ...regionsSoFar, unknown: "unknown" };
      }
    },
    {},
  );

  // Raster example - get minimum and maximum surface temperature within sketch for present day

  const minDs = project.getRasterDatasourceById("bo-present-surface-temp-min");
  const minUrl = project.getDatasourceUrl(minDs);
  const minRaster = await loadCog(minUrl);
  const minResult = await rasterStats(minRaster, {
    feature: clippedSketch,
    stats: ["min"],
  });
  const minTemp = minResult[0].min; // extract value from band 1

  const maxDs = project.getRasterDatasourceById("bo-present-surface-temp-max");
  const maxUrl = project.getDatasourceUrl(maxDs);
  const maxRaster = await loadCog(maxUrl);
  const maxResult = await rasterStats(maxRaster, {
    feature: clippedSketch,
    stats: ["max"],
  });
  const maxTemp = maxResult[0].max; // extract value from band 1

  if (!minTemp || !maxTemp) throw new Error("Missing minTemp or maxTemp");

  return {
    area: turfArea(clippedSketch),
    nearbyEcoregions: Object.keys(regionNames),
    minTemp,
    maxTemp,
  };
}

export default new GeoprocessingHandler(simpleFunction, {
  title: "simpleFunction",
  description: "Function description",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});

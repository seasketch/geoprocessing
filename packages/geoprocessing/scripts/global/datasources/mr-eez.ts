import bbox from "@turf/bbox";
import { FeatureCollection, Polygon } from "../../../src/types";
import eezPrecalc from "./mr-eez-precalc.json";

/** Marine Regions EEZ */
export type MR_EEZ_FC = FeatureCollection<
  Polygon,
  { GEONAME: string; area_turf: number }
>;

export const eezColl = eezPrecalc as unknown as MR_EEZ_FC;

export const getBbox = async (name: string) => {
  const eez = eezColl.features.find((c) => c.properties.GEONAME === name);

  if (!eez) throw new Error(`EEZ not found with name ${name}`);
  return eez.bbox || bbox(eez);
};

export const getArea = async (name: string) => {
  const eez = eezColl.features.find((c) => c.properties.GEONAME === name);

  if (!eez) throw new Error(`EEZ not found with name ${name}`);
  return eez.properties.area_turf || bbox(eez);
};

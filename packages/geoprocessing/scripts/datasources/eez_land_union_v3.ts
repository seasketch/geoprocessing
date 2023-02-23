import bbox from "@turf/bbox";
import { FeatureCollection, Polygon } from "../../src/types";
import eezCountriesJson from "../global/datasources/eez_land_union_v3.json";

export type EezCountryFC = FeatureCollection<Polygon, { UNION: string }>;

export const eezCountries = eezCountriesJson as EezCountryFC;

export const getEezCountryBbox = async (name: string) => {
  const country = eezCountries.features.find(
    (c) => c.properties.UNION === name
  );

  if (!country) throw new Error(`EEZ not found with name ${name}`);
  if (!country.geometry) throw new Error(`EEZ named ${name} has no geometry`);
  return bbox(country);
};

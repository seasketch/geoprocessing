import bbox from "@turf/bbox";
import { getTemplateDatasourcePath } from "../../scripts/init/util";
import { FeatureCollection, Polygon } from "../../src/types";

export type EezCountryFC = FeatureCollection<Polygon, { UNION: string }>;

export const getEezCountries = async () => {
  const eezCountries = (await fs.readJSON(
    `${getTemplateDatasourcePath}/eez_land_union_v3.json`
  )) as EezCountryFC;

  return eezCountries;
};

export const getEezCountryBbox = async (name: string) => {
  const countries = await getEezCountries();
  const country = countries.features.find((c) => c.properties.UNION === name);

  if (!country) throw new Error(`EEZ not found with name ${name}`);
  if (!country.geometry) throw new Error(`EEZ named ${name} has no geometry`);
  return bbox(country);
};

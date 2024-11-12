import { groupBy } from "../helpers/groupBy.js";
import {
  ExternalRasterDatasource,
  ExternalVectorDatasource,
  Feature,
  Polygon,
} from "../types/index.js";

export type OsmLandFeature = Feature<Polygon, { gid: number }>;
export type EezLandUnion = Feature<Polygon, { gid: number; UNION: string }>;

/**
 * Definitive list of global datasources for geoprocessing framework
 * @todo: fetch from global-datasources repo
 */
export const globalDatasources: (
  | ExternalVectorDatasource
  | ExternalRasterDatasource
)[] = [
  {
    datasourceId: "global-clipping-osm-land",
    geo_type: "vector",
    formats: ["subdivided"],
    classKeys: [],
    url: "https://d3p1dsef9f0gjr.cloudfront.net/",
    idProperty: "gid",
    nameProperty: "gid",
    metadata: {
      name: "OSM Land Polygons WGS84 (not split)",
      version: "20210405.0",
      publisher: "Flanders Marine Institute (VLIZ)",
      publishDate: "20210405",
      publishLink: "https://osmdata.openstreetmap.de/data/land-polygons.html",
    },
    precalc: false,
  },
  {
    datasourceId: "global-clipping-eez-land-union",
    geo_type: "vector",
    formats: ["subdivided"],
    classKeys: [],
    idProperty: "UNION",
    nameProperty: "UNION",
    url: "https://d3muy0hbwp5qkl.cloudfront.net",
    metadata: {
      name: "Marine and land zones: the union of world country boundaries and EEZ's",
      version: "3.0",
      publisher: "Flanders Marine Institute (VLIZ)",
      publishDate: "20200317",
      publishLink: "https://marineregions.org/",
    },
    precalc: false,
  },
  {
    datasourceId: "global-eez-mr-v12",
    geo_type: "vector",
    formats: ["fgb", "json"],
    metadata: {
      name: "World EEZ v11",
      description: "World EEZ boundaries and disputed areas",
      version: "11.0",
      publisher: "Flanders Marine Institute (VLIZ)",
      publishDate: "2019118",
      publishLink: "https://marineregions.org/",
    },
    classKeys: [],
    url: "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-eez-mr-v12.fgb",
    idProperty: "GEONAME",
    nameProperty: "GEONAME",
    precalc: false,
  },
];

export const globalDatasourcesById = groupBy(
  globalDatasources,
  (ds) => ds.datasourceId,
);

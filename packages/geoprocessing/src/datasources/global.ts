import { Datasource, Feature, Polygon } from "../types";

export type OsmLandFeature = Feature<Polygon, { gid: number }>;
export type EezLandUnion = Feature<Polygon, { gid: number; UNION: string }>;

/**
 * Definitive list of global datasources for geoprocessing framework
 * @todo: Move to a separate global datasource gp project
 */
export const globalDatasources: Datasource[] = [
  {
    datasourceId: "global-clipping-osm-land",
    geo_type: "vector",
    url: "https://d3p1dsef9f0gjr.cloudfront.net/",
    formats: ["subdivided"],
    classKeys: [],
    metadata: {
      name: "OSM Land Polygons WGS84 (not split)",
      idProperty: "gid",
      version: "20210405.0",
      publisher: "Flanders Marine Institute (VLIZ)",
      publishDate: "20210405",
      publishLink: "https://osmdata.openstreetmap.de/data/land-polygons.html",
    },
  },
  {
    datasourceId: "global-clipping-eez-land-union",
    geo_type: "vector",
    url: "https://d3muy0hbwp5qkl.cloudfront.net",
    formats: ["subdivided"],
    classKeys: [],
    metadata: {
      name: "Marine and land zones: the union of world country boundaries and EEZ's",
      idProperty: "UNION",
      version: "3.0",
      publisher: "Flanders Marine Institute (VLIZ)",
      publishDate: "20200317",
      publishLink: "https://marineregions.org/",
    },
  },
  {
    datasourceId: "mr-eez",
    geo_type: "vector",
    url: "",
    formats: ["subdivided"],
    classKeys: [],
    metadata: {
      name: "World EEZ v11",
      idProperty: "GEONAME",
      version: "11.0",
      publisher: "Flanders Marine Institute (VLIZ)",
      publishDate: "20191118",
      publishLink: "https://marineregions.org/",
    },
  },
];

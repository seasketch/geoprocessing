import { ProjectClientConfig } from "../../project";

const basicConfig: ProjectClientConfig = {
  basic: {
    bbox: [0, 0, 1, 1],
    noun: "undefined",
    nounPossessive: "undefined",
    externalLinks: {},
    clipDatasources: {
      land: "global-clipping-osm-land",
      eez: "global-clipping-eez-land-union",
    },
  },
  datasources: [
    {
      datasourceId: "global-clipping-osm-land",
      geo_type: "vector",
      formats: ["subdivided"],
      classKeys: [],
      url: "https://d3p1dsef9f0gjr.cloudfront.net/",
    },
    {
      datasourceId: "global-clipping-eez-land-union",
      geo_type: "vector",
      formats: ["subdivided"],
      classKeys: [],
      url: "https://d3muy0hbwp5qkl.cloudfront.net",
    },
  ],
  metricGroups: [
    {
      metricId: "boundaryAreaOverlap",
      type: "areaOverlap",
      classes: [
        {
          classId: "eez",
          display: "EEZ",
          datasourceId: "eez",
          objectiveId: "eez_objective",
          layerId: "",
        },
      ],
    },
  ],
  objectives: [
    {
      objectiveId: "eez_objective",
      shortDesc: "EEZ Objective",
      target: 0.2,
      countsToward: {
        "Fully Protected Area": "yes",
      },
    },
  ],
  package: {
    name: "test",
    version: "1.0.0",
    license: "",
    author: "",
    description: "",
    main: "src/index.js",
    scripts: {},
    keywords: ["@seasketch/geoprocessing"],
    dependencies: {
      "@turf/area": "6.5.0",
      "@turf/bbox-clip": "6.5.0",
    },
    devDependencies: {
      "@seasketch/geoprocessing": "^0.7.0",
    },
  },
  geoprocessing: {
    author: "Test <test@test.com>",
    organization: "Test Org",
    region: "us-west-1",
    preprocessingFunctions: [],
    geoprocessingFunctions: [],
    clients: [],
  },
};
export default {
  simple: basicConfig,
};

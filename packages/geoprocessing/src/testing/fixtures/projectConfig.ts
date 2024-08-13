import { ProjectClientConfig } from "../../project/ProjectClientBase.js";
import { globalDatasources } from "../../datasources/global.js";
import cloneDeep from "lodash/cloneDeep.js";

/**
 * Basic starter config with only default global datasources, no geographies or precalc metrics
 */
const simpleConfig: ProjectClientConfig = {
  basic: {
    bbox: [0, 0, 1, 1],
    planningAreaName: "undefined",
    planningAreaId: "undefined",
    planningAreaType: "eez",
    externalLinks: {},
  },
  datasources: globalDatasources,
  geographies: [],
  metricGroups: [
    {
      metricId: "boundaryAreaOverlap",
      type: "areaOverlap",
      classes: [
        {
          classId: "eez",
          display: "EEZ",
          datasourceId: "global-eez-mr-v12",
          objectiveId: "eez_objective",
          layerId: "",
        },
      ],
    },
  ],
  precalc: [],
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
      "@turf/turf": "7.1.0",
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

/**
 * ProjectClient config complete with datasources, geographies and precalc metrics
 */

const loadedConfig: ProjectClientConfig = {
  ...cloneDeep(simpleConfig),
  geographies: [
    {
      geographyId: "eez",
      datasourceId: "global-eez-mr-v12",
      display: "Samoan EEZ",
      propertyFilter: {
        property: "GEONAME",
        values: ["Samoan Exclusive Economic Zone"],
      },
      bboxFilter: [
        -174.51139447157757, -15.878383591829206, -170.54265693017294,
        -10.960825304544073,
      ],
      groups: ["default-boundary"],
      precalc: true,
    },
  ],
  precalc: [
    {
      geographyId: "eez",
      metricId: "area",
      classId: "global-eez-mr-v12-total",
      sketchId: null,
      groupId: null,
      value: 131259350503.85864,
    },
    {
      geographyId: "eez",
      metricId: "count",
      classId: "global-eez-mr-v12-total",
      sketchId: null,
      groupId: null,
      value: 1,
    },
  ],
};

export default {
  simple: simpleConfig,
  loaded: loadedConfig,
};

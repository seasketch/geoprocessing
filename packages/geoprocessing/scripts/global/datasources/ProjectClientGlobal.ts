import {
  ProjectClientConfig,
  ProjectClientBase,
} from "../../../src/project/ProjectClientBase";
import { globalDatasources } from "../../../src/datasources/global";

// Config constructed just for working with global datasources
const internalConfig: ProjectClientConfig = {
  datasources: globalDatasources,
  geographies: [],
  basic: {
    bbox: [0, 0, 1, 1],
    planningAreaName: "undefined",
    planningAreaId: "undefined",
    planningAreaType: "eez",
    externalLinks: {},
  },
  metricGroups: [],
  objectives: [],
  package: {
    name: "internal",
    version: "1.0.0",
    license: "",
    author: "",
    description: "",
    main: "src/index.js",
    scripts: {},
    dependencies: {},
    devDependencies: {},
  },
  geoprocessing: {
    author: "Internal <internal@test.com>",
    organization: "internal",
    region: "us-west-1",
    preprocessingFunctions: [],
    geoprocessingFunctions: [],
    clients: [],
  },
};

/**
 * ProjectClient for internal use only with global datasets
 */
const projectClientGlobal = new ProjectClientBase(internalConfig);
export default projectClientGlobal;

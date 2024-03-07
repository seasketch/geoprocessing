import datasources from "./datasources.json";
import geographies from "./geographies.json";
import metrics from "./metrics.json";
import objectives from "./objectives.json";
import basic from "./basic.json";

import { ProjectClientBase, GeoprocessingJsonConfig, Package } from "../../index.js";

const projectPackage: Package = {
  name: "test-project",
  version: "1.0.0",
  description: `Test project`,
  dependencies: {},
  devDependencies: {},
  author: "Test",
  license: "UNLICENSED",
};

const gp: GeoprocessingJsonConfig = {
  author: "Test",
  organization: "Seasketch",
  region: "us-west-2",
  clients: [],
  preprocessingFunctions: [],
  geoprocessingFunctions: [],
};

const projectClient = new ProjectClientBase({
  datasources,
  geographies,
  metricGroups: metrics,
  precalc: [],
  objectives,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});
export default projectClient;

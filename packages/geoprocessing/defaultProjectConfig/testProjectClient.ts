import datasources from "./project/datasources.json";
import metrics from "./project/metrics.json";
import objectives from "./project/objectives.json";
import basic from "./project/basic.json";

import { ProjectClientBase, GeoprocessingJsonConfig, Package } from "../src";

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
  metricGroups: metrics,
  objectives,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});
export default projectClient;

import datasources from "./datasources.json";
import metrics from "./metrics.json";
import objectives from "./objectives.json";
import basic from "./basic.json";
import projectPackage from "../package.json";
import gp from "../geoprocessing.json";

import { ProjectClientBase } from "@seasketch/geoprocessing";

const projectClient = new ProjectClientBase({
  datasources,
  metricGroups: metrics,
  objectives,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});
export default projectClient;

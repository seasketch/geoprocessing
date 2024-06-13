import datasources from "./datasources.json" with { type: "json" };
import metrics from "./metrics.json" with { type: "json" };
import precalc from "./precalc.json" with { type: "json" };
import objectives from "./objectives.json" with { type: "json" };
import geographies from "./geographies.json" with { type: "json" };
import basic from "./basic.json" with { type: "json" };
import gp from "./geoprocessing.json" with { type: "json" };
import projectPackage from "../package.json" with { type: "json" };

import { ProjectClientBase } from "@seasketch/geoprocessing/client-core";

const projectClient = new ProjectClientBase({
  datasources,
  metricGroups: metrics,
  precalc,
  objectives,
  geographies,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});
export default projectClient;

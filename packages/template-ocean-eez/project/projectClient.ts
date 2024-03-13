import datasources from "./datasources.json" assert { type: "json" };
import metrics from "./metrics.json" assert { type: "json" };
import precalc from "./precalc.json" assert { type: "json" };
import objectives from "./objectives.json" assert { type: "json" };
import geographies from "./geographies.json" assert { type: "json" };
import basic from "./basic.json" assert { type: "json" };
import projectPackage from "../package.json" assert { type: "json" };
import gp from "../geoprocessing.json" assert { type: "json" };

import { ProjectClientBase } from "@seasketch/geoprocessing";

const projectClient = new ProjectClientBase({
  datasources,
  metricGroups: metrics,
  precalc: precalc,
  objectives,
  geographies,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});
export default projectClient;

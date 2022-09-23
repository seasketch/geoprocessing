import { ProjectClientBase } from "../../../src/project";
import fs from "fs-extra";
import path from "path";

export function getProjectClient(projectPath: string) {
  const datasources = fs.readJsonSync(
    path.join(projectPath, "src", "project", "datasources.json")
  );
  const metrics = fs.readJsonSync(
    path.join(projectPath, "src", "project", "metrics.json")
  );
  const objectives = fs.readJsonSync(
    path.join(projectPath, "src", "project", "objectives.json")
  );
  const basic = fs.readJsonSync(
    path.join(projectPath, "src", "project", "basic.json")
  );
  const projectPackage = fs.readJsonSync(
    path.join(projectPath, "package.json")
  );
  const gp = fs.readJsonSync(path.join(projectPath, "geoprocessing.json"));

  return new ProjectClientBase({
    datasources,
    metricGroups: metrics,
    objectives,
    basic,
    package: projectPackage,
    geoprocessing: gp,
  });
}

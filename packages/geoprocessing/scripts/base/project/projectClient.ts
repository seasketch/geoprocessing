import { ProjectClientBase } from "../../../src/project";
import fs from "fs-extra";
import path from "path";

export function getProjectClient(projectPath: string) {
  const datasources = fs.readJsonSync(
    path.join(projectPath, "project", "datasources.json")
  );
  const geographies = fs.readJsonSync(
    path.join(projectPath, "project", "geographies.json")
  );
  const metrics = fs.readJsonSync(
    path.join(projectPath, "project", "metrics.json")
  );
  const objectives = fs.readJsonSync(
    path.join(projectPath, "project", "objectives.json")
  );
  const basic = fs.readJsonSync(
    path.join(projectPath, "project", "basic.json")
  );
  const projectPackage = fs.readJsonSync(
    path.join(projectPath, "package.json")
  );
  const gp = fs.readJsonSync(path.join(projectPath, "geoprocessing.json"));

  return new ProjectClientBase({
    datasources,
    geographies,
    metricGroups: metrics,
    objectives,
    basic,
    package: projectPackage,
    geoprocessing: gp,
  });
}

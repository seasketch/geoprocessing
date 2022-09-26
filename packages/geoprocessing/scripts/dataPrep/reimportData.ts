import { reimportDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);

// Wrap in an IIFE to avoid top-level await
void (async function () {
  // @ts-ignore
  await reimportDatasources(projectClient);
})();

import { publishDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";
import { publishQuestion } from "./importData";

const projectPath = process.argv[2];
const matcher = process.argv[3];
const projectClient = getProjectClient(projectPath);

// Wrap in an IIFE to avoid top-level await
void (async function () {
  await publishDatasources(projectClient, {
    matcher,
  });
})();

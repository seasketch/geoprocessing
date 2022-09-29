import { publishDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";
import { publishQuestion } from "./publishQuestion";

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const matcher = process.argv[3];
const projectClient = getProjectClient(projectPath);

void (async function () {
  const publishAnswers = await publishQuestion();

  await publishDatasources(projectClient, {
    matcher,
  });
})();

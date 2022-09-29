import { reimportDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";
import { publishQuestion } from "./publishQuestion";

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const matcher = process.argv[3];
const projectClient = getProjectClient(projectPath);

// Wrap in an IIFE to avoid top-level await
void (async function () {
  const publishAnswers = await publishQuestion(
    "Do you want to publish datasources to S3 after re-import?"
  );

  await reimportDatasources(projectClient, {
    matcher,
    doPublish: publishAnswers.publish === "yes" ? true : false,
  });
})();

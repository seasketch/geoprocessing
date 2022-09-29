import inquirer from "inquirer";
import { reimportDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";

export interface PublishAnswers {
  publish: "yes" | "no";
}

const projectPath = process.argv[2];
const matcher = process.argv[3];
const projectClient = getProjectClient(projectPath);

// Wrap in an IIFE to avoid top-level await
void (async function () {
  const publishAnswers = await publishQuestion();

  await reimportDatasources(projectClient, {
    matcher,
    doPublish: publishAnswers.publish === "yes" ? true : false,
  });
})();

export async function publishQuestion(): Promise<
  Pick<PublishAnswers, "publish">
> {
  return inquirer.prompt<Pick<PublishAnswers, "publish">>([
    {
      type: "list",
      name: "publish",
      message: "Do you want to publish to S3 cloud storage now?",
      default: "no",
      choices: [
        {
          value: "yes",
          name: "Yes",
        },
        {
          value: "no",
          name: "No",
        },
      ],
    },
  ]);
}

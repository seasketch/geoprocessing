import inquirer from "inquirer";
import { Datasources } from "../../src";
import { reimportDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";
import { publishQuestion } from "./publishQuestion";

export interface ReimportAnswers {
  publish: "yes" | "no";
}

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);
const numDs = projectClient.datasources.length;

// Wrap in an IIFE to avoid top-level await
void (async function () {
  const reimportAllAnswers = await reimportAllQuestion(numDs);
  const publishAnswers = await publishQuestion(
    "Do you want to publish datasources to S3 after re-import?"
  );

  if (reimportAllAnswers.publish === "yes") {
    await reimportDatasources(projectClient, {
      doPublish: publishAnswers.publish === "yes" ? true : false,
    });
  } else {
    const dsAnswers = await datasourcesQuestion(projectClient.datasources);
    await reimportDatasources(projectClient, {
      doPublish: publishAnswers.publish === "yes" ? true : false,
      matcher: dsAnswers.datasources,
    });
  }
})();

export async function reimportAllQuestion(
  numDs: number
): Promise<Pick<ReimportAnswers, "publish">> {
  return inquirer.prompt<Pick<ReimportAnswers, "publish">>([
    {
      type: "list",
      name: "publish",
      message: `Do you want to reimport all ${numDs} datasources at once?`,
      default: "no",
      choices: [
        {
          value: "no",
          name: "No, let me choose",
        },
        {
          value: "yes",
          name: "Yes",
        },
      ],
    },
  ]);
}

export interface DatasourcesAnswers {
  datasources: string[];
}

export async function datasourcesQuestion(
  datasources: Datasources
): Promise<DatasourcesAnswers> {
  const datasourcesQuestion = await getDatasourcesQuestion(datasources);
  const answer = await inquirer.prompt<DatasourcesAnswers>([
    datasourcesQuestion,
  ]);
  return answer;
}

export async function getDatasourcesQuestion(datasources: Datasources) {
  if (datasources.length === 0) {
    console.error("No datasources found, exiting");
    process.exit();
  }

  const datasourceQuestion = {
    type: "checkbox",
    name: "datasources",
    message:
      "What datasources would you like to reimport? (select as many as you want)",
    choices: [],
  };

  return {
    ...datasourceQuestion,
    choices: [
      ...datasourceQuestion.choices,
      ...datasources.map((ds) => ({
        value: ds.datasourceId,
        name: `${ds.datasourceId} - ${ds.geo_type}`,
      })),
    ],
  };
}

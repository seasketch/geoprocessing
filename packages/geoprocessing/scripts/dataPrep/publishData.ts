import inquirer from "inquirer";
import { Datasource, isinternalDatasource } from "../../src/index.js";
import { publishDatasources } from "../base/datasources/index.js";
import { getProjectClient } from "../base/project/projectClient.js";

export interface PublishAnswers {
  publish: "yes" | "no";
}

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);
const internalDatasources = projectClient.datasources.filter((ds) => isinternalDatasource(ds));
const numDs = internalDatasources.length;

void (async function () {
  const publishAllAnswers = await publishAllQuestion(numDs);

  if (publishAllAnswers.publish === "yes") {
    await publishDatasources(projectClient);
  } else {
    const dsAnswers = await datasourcesQuestion(internalDatasources);
    await publishDatasources(projectClient, { matcher: dsAnswers.datasources });
  }
})();

export async function publishAllQuestion(
  numDs: number
): Promise<Pick<PublishAnswers, "publish">> {
  return inquirer.prompt<Pick<PublishAnswers, "publish">>([
    {
      type: "list",
      name: "publish",
      message: `Do you want to publish all ${numDs} datasources at once?`,
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
  datasources: Datasource[]
): Promise<DatasourcesAnswers> {
  const datasourcesQuestion = await getDatasourcesQuestion(datasources);
  const answer = await inquirer.prompt<DatasourcesAnswers>([
    datasourcesQuestion,
  ]);
  return answer;
}

export async function getDatasourcesQuestion(datasources: Datasource[]) {
  if (datasources.length === 0) {
    console.error("No datasources found, exiting");
    process.exit();
  }

  const datasourceQuestion = {
    type: "checkbox",
    name: "datasources",
    message:
      "What datasources would you like to publish? (select as many as you want)",
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

import inquirer from "inquirer";
import { Datasource, isinternalDatasource } from "../../src/index.js";
import { reimportDatasources } from "../base/datasources/index.js";
import { getProjectClient } from "../base/project/projectClient.js";
export interface ReimportAnswers {
  reimportAll: "yes" | "no";
}

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);
const internalDatasources = projectClient.datasources.filter((ds) =>
  isinternalDatasource(ds),
);
const numDs = internalDatasources.length;

const reimportAllAnswers = await reimportAllQuestion(numDs);

if (reimportAllAnswers.reimportAll === "yes") {
  await reimportDatasources(projectClient, {});
} else {
  const dsAnswers = await datasourcesQuestion(internalDatasources);
  await reimportDatasources(projectClient, {
    matcher: dsAnswers.datasources,
  });
}

export async function reimportAllQuestion(
  numDs: number,
): Promise<Pick<ReimportAnswers, "reimportAll">> {
  return inquirer.prompt<Pick<ReimportAnswers, "reimportAll">>([
    {
      type: "list",
      name: "reimportAll",
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
  datasources: Datasource[],
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

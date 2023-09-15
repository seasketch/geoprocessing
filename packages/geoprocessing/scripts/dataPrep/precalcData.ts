import inquirer from "inquirer";
import { Datasource } from "../../src";
import { precalcDatasources } from "../base/datasources";
import { getProjectClient } from "../base/project/projectClient";

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);
const numDs = projectClient.internalDatasources.length;

// Wrap in an IIFE to avoid top-level await
void (async function () {
  if (numDs === 0) {
    console.error("No precalc-able datasources found, exiting");
    process.exit();
  }

  // If there's only one datasource, jump straight to precalculating it
  const precalcAnswers =
    numDs === 1 ? { precalcWhich: "all" } : await precalcWhichDsQuestion(numDs);

  if (precalcAnswers.precalcWhich === "all") {
    await precalcDatasources(projectClient);
  } else {
    const dsAnswers = await datasourcesQuestion(
      projectClient.internalDatasources
    );
    await precalcDatasources(projectClient, {
      datasourceMatcher: dsAnswers.datasources,
    });
  }
})();

export interface PrecalcAnswers {
  precalcWhich: "list" | "all";
}

export async function precalcWhichDsQuestion(
  numDs: number
): Promise<Pick<PrecalcAnswers, "precalcWhich">> {
  return inquirer.prompt<Pick<PrecalcAnswers, "precalcWhich">>([
    {
      type: "list",
      name: "precalcWhich",
      message: `Which datasources do you want to precalculate?`,
      default: "list",
      choices: [
        {
          value: "list",
          name: "Let me choose from a list",
        },
        {
          value: "all",
          name: `All ${numDs} datasources (may take a while)`,
        },
      ],
    },
  ]);
}

export async function precalcWhichGeogsQuestion(
  numDs: number
): Promise<Pick<PrecalcAnswers, "precalcWhich">> {
  return inquirer.prompt<Pick<PrecalcAnswers, "precalcWhich">>([
    {
      type: "list",
      name: "precalcWhich",
      message: `Which datasources do you want to precalculate?`,
      default: "list",
      choices: [
        {
          value: "list",
          name: "Let me choose from a list",
        },
        {
          value: "all",
          name: `All ${numDs} datasources (may take a while)`,
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
      "What datasources would you like to precalculate? (select as many as you want)",
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

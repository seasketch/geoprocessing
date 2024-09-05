import inquirer from "inquirer";
import { Datasource, Geography } from "../../src/index.js";
import {
  PrecalcDatasourceOptions,
  precalcDatasources,
} from "../base/datasources/index.js";
import { getProjectClient } from "../base/project/projectClient.js";

// This is a standalone script used as a CLI command with a top-level function

const projectPath = process.argv[2];
const projectClient = getProjectClient(projectPath);
const numDs = projectClient.datasources.filter(
  (d) => d.precalc === true,
).length;
const numGeos = projectClient.geographies.filter(
  (g) => g.precalc === true,
).length;

// Wrap in an IIFE to use async/await
void (async function () {
  if (numDs === 0) {
    console.error("No precalc-able datasources found, exiting");
    process.exit();
  }

  if (numGeos === 0) {
    console.error("No precalc-able geographies found, exiting");
    process.exit();
  }

  const subsetAnswer = await precalcSubsetQuestion();

  const dsOptions: PrecalcDatasourceOptions = {
    datasourceMatcher: [],
    geographyMatcher: [],
  };
  if (["all", "both", "datasource"].includes(subsetAnswer.subset)) {
    if (subsetAnswer.subset === "all") {
      dsOptions.datasourceMatcher = ["*"];
    } else {
      const precalcDs = projectClient.datasources.filter(
        (ds) => ds.precalc === true,
      );
      // Ask user what they want to precalculate
      const precalcDsAnswers = await precalcWhichDsQuestion(numDs);
      if (precalcDsAnswers.precalcWhichDs === "list") {
        const dsAnswers = await datasourcesQuestion(precalcDs);
        dsOptions.datasourceMatcher = dsAnswers.datasources;
      }
    }
  }

  const geogOptions: PrecalcDatasourceOptions = {};
  if (["all", "both", "geography"].includes(subsetAnswer.subset)) {
    if (subsetAnswer.subset === "all") {
      dsOptions.geographyMatcher = ["*"];
    } else {
      const precalcDs = projectClient.geographies.filter(
        (geog) => geog.precalc === true,
      );
      // Ask user what they want to precalculate
      const precalcGeosAnswers = await precalcWhichGeosQuestion(numGeos);
      if (precalcGeosAnswers.precalcWhichGeos === "list") {
        const geogAnswers = await geographiesQuestion(
          projectClient.geographies,
        );
        geogOptions.geographyMatcher = geogAnswers.geographies;
      }
    }
  }

  // Then precalculate
  await precalcDatasources(projectClient, { ...dsOptions, ...geogOptions });
})();

export interface PrecalcSubsetAnswer {
  subset: string;
}

export async function precalcSubsetQuestion(): Promise<PrecalcSubsetAnswer> {
  return inquirer.prompt<PrecalcSubsetAnswer>([
    {
      type: "list",
      name: "subset",
      message: `Do you want to precalculate only a subset?`,
      default: "datasource",
      choices: [
        {
          value: "datasource",
          name: "Yes, by datasource",
        },
        {
          value: "geography",
          name: "Yes, by geography",
        },
        {
          value: "both",
          name: `Yes, by both`,
        },
        {
          value: "all",
          name: "No, just precalculate everything (may take a while)",
        },
      ],
    },
  ]);
}

export interface PrecalcAnswers {
  precalcWhichDs: "list" | "all";
  precalcWhichGeos: "list" | "all";
}

export async function precalcWhichDsQuestion(
  numDs: number,
): Promise<Pick<PrecalcAnswers, "precalcWhichDs">> {
  return inquirer.prompt<Pick<PrecalcAnswers, "precalcWhichDs">>([
    {
      type: "list",
      name: "precalcWhichDs",
      message: `Which datasources do you want to precalculate? (will precalculate for all geographies)`,
      default: "list",
      choices: [
        {
          value: "list",
          name: "Let me choose",
        },
        {
          value: "all",
          name: `All ${numDs} datasources`,
        },
      ],
    },
  ]);
}

export interface PrecalcGeosAnswers {
  precalcWhichGeos: "list" | "all";
}

export async function precalcWhichGeosQuestion(
  numDs: number,
): Promise<Pick<PrecalcAnswers, "precalcWhichGeos">> {
  return inquirer.prompt<Pick<PrecalcAnswers, "precalcWhichGeos">>([
    {
      type: "list",
      name: "precalcWhichGeos",
      message: `Which geographies do you want to precalculate? (will precalculate for all datasources)`,
      default: "list",
      choices: [
        {
          value: "list",
          name: "Let me choose",
        },
        {
          value: "all",
          name: `All ${numGeos} geographies`,
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

export interface GeographiesAnswers {
  geographies: string[];
}

export async function geographiesQuestion(
  geographies: Geography[],
): Promise<GeographiesAnswers> {
  const geographiesQuestion = await getGeographiesQuestion(geographies);
  const answer = await inquirer.prompt<GeographiesAnswers>([
    geographiesQuestion,
  ]);
  return answer;
}

export async function getGeographiesQuestion(geographies: Geography[]) {
  if (geographies.length === 0) {
    console.error("No geographies found, exiting");
    process.exit();
  }

  const geographyQuestion = {
    type: "checkbox",
    name: "geographies",
    message:
      "What geographies would you like to precalculate? (select as many as you want)",
    choices: [],
  };

  return {
    ...geographyQuestion,
    choices: [
      ...geographyQuestion.choices,
      ...geographies.map((geog) => ({
        value: geog.geographyId,
        name: `${geog.geographyId} - ${geog.display}`,
      })),
    ],
  };
}

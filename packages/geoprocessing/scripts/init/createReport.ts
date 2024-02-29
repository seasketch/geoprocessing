import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import camelcase from "camelcase";
import {
  ExecutionMode,
  metricGroupsSchema,
  GeoprocessingJsonConfig,
} from "../../src/types";
import {
  getBlankComponentPath,
  getBlankFunctionPath,
  getOceanEEZComponentPath,
  getOceanEEZFunctionPath,
  getProjectComponentPath,
  getProjectConfigPath,
  getProjectFunctionPath,
} from "../util/getPaths";

const createReport = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Type of report to create",
      choices: [
        {
          value: "blank",
          name: "Blank report",
        },
        {
          value: "raster",
          name: "Raster overlap report - Calculates sketch overlap with raster data sources",
        },
        {
          value: "vector",
          name: "Vector overlap report - Calculates sketch overlap with vector data sources",
        },
      ],
    },
    {
      type: "input",
      name: "description",
      message: "Describe what this report calculates",
    },
    {
      type: "list",
      name: "executionMode",
      message: "Choose an execution mode for this report",
      choices: [
        {
          value: "sync",
          name: "Sync - Best for quick analyses (< 2s)",
        },
        {
          value: "async",
          name: "Async - Better for long-running processes",
        },
      ],
    },
  ]);

  // Get title of report either from metrics.json or user input
  if (answers.type === "raster" || answers.type === "vector") {
    const rawMetrics = fs.readJSONSync(
      `${getProjectConfigPath("")}/metrics.json`
    );
    const metrics = metricGroupsSchema.parse(rawMetrics);
    const titleChoiceQuestion = {
      type: "list",
      name: "title",
      message: "Select the metric group to report on",
      choices: metrics.map((metric) => metric.metricId),
    };
    const { title } = await inquirer.prompt([titleChoiceQuestion]);
    answers.title = title;

    if (answers.type === "raster") {
      const statQuestion = {
        type: "list",
        name: "stat",
        message: "Statistic to calculate",
        choices: ["sum", "count", "area"],
      };
      const { stat } = await inquirer.prompt([statQuestion]);
      answers.stat = stat;
    } else {
      // Vector
      answers.stat = "area";
    }
  } else if (answers.type === "blank") {
    const titleQuestion = {
      type: "input",
      name: "title",
      message: "Title for this report, in camelCase",
      default: "newReport",
      validate: (value: any) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: (value: any) => camelcase(value),
    };
    const { title } = await inquirer.prompt([titleQuestion]);
    answers.title = title;
  }

  return answers;
};

if (require.main === module) {
  createReport()
    .then(async (answers) => {
      await makeReport(answers, true, "");
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
}

export async function makeReport(
  options: ReportOptions,
  interactive = true,
  basePath = "./"
) {
  // Start interactive spinner
  const spinner = interactive
    ? ora("Creating new report").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);

  // Get paths
  const projectFunctionPath = getProjectFunctionPath(basePath);
  const projectComponentPath = getProjectComponentPath(basePath);

  const templateFuncPath =
    options.type === "blank"
      ? getBlankFunctionPath()
      : getOceanEEZFunctionPath();
  const templateFuncTestPath = `${getBlankFunctionPath()}/blankFunctionSmoke.test.ts`;
  const templateCompPath =
    options.type === "blank"
      ? getBlankComponentPath()
      : getOceanEEZComponentPath();
  const templateCompStoriesPath = `${getBlankComponentPath()}/BlankCard.stories.tsx`;

  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "functions"))) {
    fs.mkdirSync(path.join(basePath, "src", "functions"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "components"))) {
    fs.mkdirSync(path.join(basePath, "src", "components"));
  }

  const defaultFuncName =
    options.type === "raster"
      ? "rasterFunction"
      : options.type === "vector"
      ? "vectorFunction"
      : "blankFunction";
  const defaultFuncRegex =
    options.type === "raster"
      ? /rasterFunction/g
      : options.type === "vector"
      ? /vectorFunction/g
      : /blankFunction/g;
  const blankFuncRegex = /blankFunction/g;
  const defaultCompName =
    options.type === "raster" || options.type === "vector"
      ? "OverlapCard"
      : "BlankCard";
  const defaultCompRegex =
    options.type === "raster" || options.type === "vector"
      ? /OverlapCard/g
      : /BlankCard/g;
  const blankCompRegex = /BlankCard/g;

  const funcCode = await fs.readFile(
    `${templateFuncPath}/${defaultFuncName}.ts`
  );
  const testFuncCode = await fs.readFile(templateFuncTestPath);
  const componentCode = await fs.readFile(
    `${templateCompPath}/${defaultCompName}.tsx`
  );
  const storiesComponentCode = await fs.readFile(templateCompStoriesPath);

  const funcName = options.title;
  const compName = funcName.charAt(0).toUpperCase() + funcName.slice(1);

  // Write function file
  await fs.writeFile(
    `${projectFunctionPath}/${funcName}.ts`,
    funcCode
      .toString()
      .replace(defaultFuncRegex, funcName)
      .replace(`"async"`, `"${options.executionMode}"`)
      .replace("Function description", options.description)
      .replace(`stats: ["sum"]`, `stats: ["${options.stat}"]`) // for raster
  );

  // Write function smoke test file
  await fs.writeFile(
    `${projectFunctionPath}/${funcName}Smoke.test.ts`,
    testFuncCode.toString().replace(blankFuncRegex, funcName)
  );

  // Write component file
  await fs.writeFile(
    `${projectComponentPath}/${compName}.tsx`,
    componentCode
      .toString()
      .replace(defaultCompRegex, `${compName}`)
      .replace(defaultFuncRegex, `${funcName}`)
      .replace(/overlapFunction/g, `${funcName}`)
      .replace(`"sum"`, `"${options.stat}"`) // for raster/vector overlap reports
  );

  // Write component stories file
  await fs.writeFile(
    `${projectComponentPath}/${compName}.stories.tsx`,
    storiesComponentCode
      .toString()
      .replace(blankCompRegex, `${compName}`)
      .replace(blankFuncRegex, `${funcName}`)
  );

  // Add function to geoprocessing.json
  const geoprocessingJson = JSON.parse(
    fs.readFileSync(path.join(basePath, "geoprocessing.json")).toString()
  ) as GeoprocessingJsonConfig;
  geoprocessingJson.geoprocessingFunctions =
    geoprocessingJson.geoprocessingFunctions || [];
  geoprocessingJson.geoprocessingFunctions.push(
    `src/functions/${options.title}.ts`
  );
  fs.writeFileSync(
    path.join(basePath, "geoprocessing.json"),
    JSON.stringify(geoprocessingJson, null, "  ")
  );

  // Finish and show next steps
  spinner.succeed(`Created ${options.title} report`);
  if (interactive) {
    console.log(chalk.blue(`\nReport successfully created!`));
    console.log(
      chalk.blue(`Function: ${`${projectFunctionPath}/${funcName}.ts`}`)
    );
    console.log(
      chalk.blue(`Component: ${`${projectComponentPath}/${compName}.tsx`}`)
    );
    console.log(`\nNext Steps:
    * Add your new <${compName} /> component to your reports by adding it to Viability.tsx or Representation.tsx
    * Run 'npm test' to run smoke tests against your new function
    * View your report using 'npm start-storybook' with smoke test output
  `);
  }
}

export { createReport };

interface ReportOptions {
  type: string;
  stat?: string;
  sumProperty?: string;
  title: string;
  executionMode: ExecutionMode;
  description: string;
}

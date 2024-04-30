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
} from "../../src/types/index.js";
import {
  getBlankComponentPath,
  getBlankFunctionPath,
  getOceanEEZComponentPath,
  getOceanEEZFunctionPath,
  getProjectComponentPath,
  getProjectConfigPath,
  getProjectFunctionPath,
} from "../util/getPaths.js";

// CLI questions
const createReport = async () => {
  // Report type, description, and execution mode
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

  // Title of report
  if (answers.type === "raster" || answers.type === "vector") {
    // For raster and vector overlap reports, we need to know which metric group to report on
    const rawMetrics = fs.readJSONSync(
      `${getProjectConfigPath("")}/metrics.json`
    );
    const metrics = metricGroupsSchema.parse(rawMetrics);
    const geoprocessingJson = JSON.parse(
      fs.readFileSync("./geoprocessing.json").toString()
    ) as GeoprocessingJsonConfig;
    const gpFunctions = geoprocessingJson.geoprocessingFunctions || [];
    const availableMetricGroups = metrics
      .map((metric) => metric.metricId)
      .filter(
        (metricId) => !gpFunctions.includes(`src/functions/${metricId}.ts`)
      );
    if (!availableMetricGroups.length)
      throw new Error(
        "All existing metric groups have reports. Either create a new metric group or delete an existing report, then try again."
      );

    // Only allow creation of reports for unused metric groups (prevents overwriting)
    const titleChoiceQuestion = {
      type: "list",
      name: "title",
      message: "Select the metric group to report on",
      choices: availableMetricGroups,
    };
    const { title } = await inquirer.prompt([titleChoiceQuestion]);
    answers.title = title;
  } else {
    // User inputs title
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

  // Stat to calculate
  if (answers.type === "raster") {
    const measurementTypeQuestion = {
      type: "list",
      name: "measurementType",
      message: "Type of raster data",
      choices: [
        {
          value: "quantitative",
          name: "Quantitative - Continuous variable across the raster",
        },
        {
          value: "categorical",
          name: "Categorical - Discrete values representing different classes",
        },
      ],
    };
    const { measurementType } = await inquirer.prompt([
      measurementTypeQuestion,
    ]);
    answers.measurementType = measurementType;

    if (answers.measurementType === "quantitative") {
      const statQuestion = {
        type: "list",
        name: "stat",
        message: "Statistic to calculate",
        choices: ["sum", "count", "area"],
      };
      const { stat } = await inquirer.prompt([statQuestion]);
      answers.stat = stat;
    } else {
      answers.stat = "valid";
    }
  } else if (answers.type === "vector") {
    // For vector overlap reports, use area stat
    answers.stat = "area";
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

  // Get defaults to replace
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

  // Load code templates
  const funcCode = await fs.readFile(
    `${templateFuncPath}/${defaultFuncName}.ts`
  );
  const testFuncCode = await fs.readFile(templateFuncTestPath);
  const componentCode = await fs.readFile(
    `${templateCompPath}/${defaultCompName}.tsx`
  );
  const storiesComponentCode = await fs.readFile(templateCompStoriesPath);

  // User inputs to replace defaults
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
    * View your report using 'npm storybook' with smoke test output
  `);
  }
}

export { createReport };

interface ReportOptions {
  type: string;
  stat?: string;
  title: string;
  executionMode: ExecutionMode;
  description: string;
}

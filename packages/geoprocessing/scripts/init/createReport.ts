import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "node:path";
import chalk from "chalk";
import camelcase from "camelcase";
import {
  ExecutionMode,
  metricGroupsSchema,
  GeoprocessingJsonConfig,
} from "../../src/types/index.js";
import {
  getOceanEEZComponentPath,
  getOceanEEZFunctionPath,
  getProjectComponentPath,
  getProjectConfigPath,
  getProjectFunctionPath,
} from "../util/getPaths.js";
import { pathToFileURL } from "node:url";

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
          name: "Blank report - empty report ready to build from scratch",
        },
        {
          value: "raster",
          name: "Raster overlap report - calculates sketch overlap with raster datasources",
        },
        {
          value: "vector",
          name: "Vector overlap report - calculates sketch overlap with vector datasources",
        },
      ],
    },
    {
      type: "input",
      name: "description",
      message:
        "Describe what this reports geoprocessing function will calculate (e.g. Calculate sketch overlap with boundary polygons)",
    },
  ]);

  answers.executionMode = "async";

  // Title of report
  if (answers.type === "raster" || answers.type === "vector") {
    // For raster and vector overlap reports, we need to know which metric group to report on
    const rawMetrics = fs.readJSONSync(
      `${getProjectConfigPath("")}/metrics.json`,
    );
    const metrics = metricGroupsSchema.parse(rawMetrics);
    const geoprocessingJson = JSON.parse(
      fs.readFileSync("./project/geoprocessing.json").toString(),
    ) as GeoprocessingJsonConfig;
    const gpFunctions = geoprocessingJson.geoprocessingFunctions || [];
    const availableMetricGroups = metrics
      .map((metric) => metric.metricId)
      .filter(
        (metricId) => !gpFunctions.includes(`src/functions/${metricId}.ts`),
      );
    if (!availableMetricGroups.length)
      throw new Error(
        "All existing metric groups have reports. Either create a new metric group in project/metrics.json or delete an existing report, then try again.",
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
        choices: [
          {
            value: "valid",
            name: "valid - count of valid raster cells overlapping with sketch (not nodata cells)",
          },
          {
            value: "count",
            name: "count - count of all raster cells overlapping with sketch (valid and invalid)",
          },
          {
            value: "sum",
            name: "sum - sum of value of valid cells overlapping with sketch",
          },
          {
            value: "area",
            name: "area - area in square meters of valid raster cells overlapping with sketch",
          },
        ],
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const answers = await createReport();
    await makeReport(answers, true, "");
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

export async function makeReport(
  options: ReportOptions,
  interactive = true,
  basePath = "./",
) {
  // Start interactive spinner
  const spinner = interactive
    ? ora("Creating new report").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);

  // Get paths
  const projectFunctionPath = getProjectFunctionPath(basePath);
  const projectComponentPath = getProjectComponentPath(basePath);

  const templateFuncPath = getOceanEEZFunctionPath();
  const templateFuncTestPath = `${templateFuncPath}/blankFunctionSmoke.test.ts`;
  const templateCompPath = getOceanEEZComponentPath();
  const templateCompStoriesPath = `${getOceanEEZComponentPath()}/BlankCard.example-stories.ts`;

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
    `${templateFuncPath}/${defaultFuncName}.ts`,
  );
  const testFuncCode = await fs.readFile(templateFuncTestPath);
  const componentCode = await fs.readFile(
    `${templateCompPath}/${defaultCompName}.tsx`,
  );
  const storiesComponentCode = await fs.readFile(templateCompStoriesPath);

  // User inputs to replace defaults
  const funcName = options.title;
  const compName =
    funcName.charAt(0).toUpperCase() + funcName.slice(1) + "Card";

  // Write function file
  await fs.writeFile(
    `${projectFunctionPath}/${funcName}.ts`,
    funcCode
      .toString()
      .replace(defaultFuncRegex, funcName)
      .replace(`"async"`, `"${options.executionMode}"`)
      .replace("Function description", options.description)
      .replace(`stats: ["sum"]`, `stats: ["${options.stat}"]`), // for raster
  );

  // Write function smoke test file
  await fs.writeFile(
    `${projectFunctionPath}/${funcName}Smoke.test.ts`,
    testFuncCode.toString().replaceAll(blankFuncRegex, funcName),
  );

  // Write component file
  await fs.writeFile(
    `${projectComponentPath}/${compName}.tsx`,
    componentCode
      .toString()
      .replace(defaultCompRegex, compName)
      .replace(defaultFuncRegex, `${funcName}`)
      .replaceAll("overlapFunction", `${funcName}`)
      .replace(`"sum"`, `"${options.stat}"`), // for raster/vector overlap reports
  );

  // Write component stories file
  await fs.writeFile(
    `${projectComponentPath}/${compName}.example-stories.ts`,
    storiesComponentCode
      .toString()
      .replaceAll(blankCompRegex, compName)
      .replaceAll(blankFuncRegex, `${funcName}`),
  );

  // Add function to geoprocessing.json
  const geoprocessingJson = JSON.parse(
    fs
      .readFileSync(path.join(basePath, "project", "geoprocessing.json"))
      .toString(),
  ) as GeoprocessingJsonConfig;
  geoprocessingJson.geoprocessingFunctions =
    geoprocessingJson.geoprocessingFunctions || [];
  geoprocessingJson.geoprocessingFunctions.push(
    `src/functions/${options.title}.ts`,
  );
  fs.writeFileSync(
    path.join(basePath, "project", "geoprocessing.json"),
    JSON.stringify(geoprocessingJson, null, "  "),
  );

  // Finish and show next steps
  spinner.succeed(`Created ${options.title} report`);
  spinner.succeed("Registered report assets in project/geoprocessing.json");
  if (interactive) {
    console.log("\n");
    console.log(
      chalk.blue(
        `Geoprocessing function: ${`${projectFunctionPath}/${funcName}.ts`}`,
      ),
    );
    console.log(
      chalk.blue(
        `Smoke test: ${`${projectFunctionPath}/${funcName}Smoke.test.ts`}`,
      ),
    );
    console.log(
      chalk.blue(
        `Report component: ${`${projectComponentPath}/${compName}.tsx`}`,
      ),
    );
    console.log(
      chalk.blue(
        `Story generator: ${`${projectComponentPath}/${compName}.example-stories.ts`}`,
      ),
    );
    console.log(`\nNext Steps:
    * 'npm test' to run smoke tests against your new geoprocessing function
    * 'npm run storybook' to view your new report with smoke test output
    * Add <${compName} /> to a top-level report client or page when ready
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

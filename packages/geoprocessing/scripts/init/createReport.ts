import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "node:path";
import chalk from "chalk";
import camelcase from "camelcase";
import { $ } from "zx";
import {
  ExecutionMode,
  GeoprocessingJsonConfig,
  MetricGroup,
} from "../../src/types/index.js";
import {
  getBlankComponentPath,
  getBlankFunctionPath,
  getOceanEEZComponentPath,
  getOceanEEZFunctionPath,
  getProjectComponentPath,
  getProjectFunctionPath,
} from "../util/getPaths.js";
import { pathToFileURL } from "node:url";
import { readDatasources } from "../base/index.js";
import {
  isinternalDatasource,
  isInternalVectorDatasource,
  isRasterDatasource,
  isVectorDatasource,
} from "../../client-core.js";

// CLI questions
const createReport = async () => {
  const title = await getTitle();
  const description = await getReportDescription();
  const type = await getReportType();
  const measurementType = type === "raster" ? await getMeasurementType() : null;
  const stat = type === "raster" ? await getStat(measurementType) : "area";
  const executionMode = await getExecutionMode();

  // Build metric group for report
  if (type === "raster" || type === "vector") {
    const datasources = readDatasources()
      .filter(
        (ds) =>
          isinternalDatasource(ds) &&
          ds.geo_type === type &&
          (isVectorDatasource(ds) || ds.measurementType === measurementType),
      )
      .map((ds) => ds.datasourceId);

    if (!datasources.length)
      throw new Error(
        `No ${type} datasources found. Please add a datasource in project/datasources.json using import:data and try again.`,
      );

    const { selectedDs } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedDs",
        message: "Select datasources to include in this report",
        choices: datasources,
      },
    ]);

    console.log("Building a metric group for:", selectedDs);

    const metricGroup: MetricGroup = {
      metricId: title,
      type: "areaOverlap",
      classes: [],
    };

    await Promise.all(
      selectedDs.forEach(async (datasourceId) => {
        const ds = readDatasources().find(
          (ds) => ds.datasourceId === datasourceId,
        );

        if (isRasterDatasource(ds)) {
          console.log("raster");
        } else if (isVectorDatasource(ds)) {
          if (ds.classKeys.length === 0) {
            metricGroup.classes.push({
              classId: ds.datasourceId,
              display: ds.datasourceId,
              datasourceId: ds.datasourceId,
            });
          } else {
            const { stdout } =
              await $`ogrinfo -geom=NO -features -json ${isInternalVectorDatasource(ds) ? ds.src : ds.url}`;
            const layer = JSON.parse(stdout).layers.find(
              (layer) => layer.name === ds.layerName,
            );
            const featureNames = layer.features
              .map((feature) => feature.properties[ds.classKeys[0]])
              .sort()
              .filter((value, index, self) => self.indexOf(value) === index);

            metricGroup.classes = metricGroup.classes.concat(
              featureNames.map((c) => ({
                classId: c,
                classKey: ds.classKeys[0],
                display: c,
                datasourceId: ds.datasourceId,
              })),
            );
          }
        } else throw new Error("Invalid datasource type");
      }),
    );
  }

  return { type, stat, title, executionMode, description };
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

  const templateFuncPath =
    options.type === "blank"
      ? getBlankFunctionPath()
      : getOceanEEZFunctionPath();
  const templateFuncTestPath = `${getBlankFunctionPath()}/blankFunctionSmoke.test.ts`;
  const templateCompPath =
    options.type === "blank"
      ? getBlankComponentPath()
      : getOceanEEZComponentPath();
  const templateCompStoriesPath = `${getBlankComponentPath()}/BlankCard.example-stories.ts`;

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
  const compName = funcName.charAt(0).toUpperCase() + funcName.slice(1);

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
      .replace(defaultCompRegex, `${compName}`)
      .replace(defaultFuncRegex, `${funcName}`)
      .replaceAll("overlapFunction", `${funcName}`)
      .replace(`"sum"`, `"${options.stat}"`), // for raster/vector overlap reports
  );

  // Write component stories file
  await fs.writeFile(
    `${projectComponentPath}/${compName}.example-stories.ts`,
    storiesComponentCode
      .toString()
      .replaceAll(blankCompRegex, `${compName}`)
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
  if (interactive) {
    console.log(chalk.blue(`\nReport successfully created!`));
    console.log(
      chalk.blue(`Function: ${`${projectFunctionPath}/${funcName}.ts`}`),
    );
    console.log(
      chalk.blue(`Component: ${`${projectComponentPath}/${compName}.tsx`}`),
    );
    console.log(`\nNext Steps:
    * Add your new <${compName} /> component to one of your reports (e.g. src/clients/SimpleReport.tsx) or report pages (e.g. src/components/ViabilityPage.tsx)
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

const getTitle = async () => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Title for this report, in camelCase",
      default: "newReport",
      validate: (value: any) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: (value: any) => camelcase(value),
    },
  ]);
};

const getReportType = async () => {
  return await inquirer.prompt([
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
  ]);
};

const getMeasurementType = async () => {
  return await inquirer.prompt([
    {
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
    },
  ]);
};

const getStat = async (measurementType: string) => {
  return measurementType === "quantitative"
    ? await inquirer.prompt([
        {
          type: "list",
          name: "stat",
          message: "Statistic to calculate",
          choices: ["sum", "count", "area"],
        },
      ])
    : "valid";
};

const getReportDescription = async () => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "Describe what this report calculates",
    },
  ]);
};

const getExecutionMode = async () => {
  return await inquirer.prompt([
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
};

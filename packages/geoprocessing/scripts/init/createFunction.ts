import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { ExecutionMode, projectSchema } from "../../src/types";
import camelcase from "camelcase";
import { GeoprocessingJsonConfig } from "../../src/types";
import {
  getBaseFunctionPath,
  getProjectFunctionPath,
  getProjectConfigPath,
} from "../util/getPaths";

async function createFunction() {
  const rawBasic = fs.readJSONSync(`${getProjectConfigPath("")}/basic.json`);
  console.log("basic", JSON.stringify(rawBasic));
  const basic = projectSchema.parse(rawBasic);

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Function type",
      choices: [
        {
          value: "preprocessing",
          name: "Preprocessing - Validates and modifies user-drawn shapes",
        },
        {
          value: "geoprocessing",
          name: "Geoprocessing - For sketch reports",
        },
      ],
    },
    {
      type: "input",
      name: "title",
      message: "Title for this function, in camelCase",
      default: (answers) =>
        answers.type === "preprocessing" ? "clipToOceanEez" : "area",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: (value) => camelcase(value),
    },
    {
      type: "input",
      name: "description",
      message: "Describe what this function does",
    },
    {
      when: (answers) =>
        answers.type === "preprocessing" && basic.planningAreaType === "eez",
      type: "list",
      name: "clipToEez",
      message: `Should this clip sketches to the ${basic.noun} EEZ boundary?`,
      default: "yes",
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
    {
      type: "list",
      name: "executionMode",
      message: "Choose an execution mode",
      default: 0,
      when: (answers) => answers.type === "geoprocessing",
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
  answers.title = camelcase(answers.title);
  if (answers.type === "preprocessing" && answers.clipToEez === "yes") {
    answers.eez = basic.noun;
  }

  if (answers.type === "geoprocessing") {
    await makeGeoprocessingHandler(answers, true, "");
  } else {
    await makePreprocessingHandler(answers, true, "");
  }
}

if (require.main === module) {
  createFunction();
}

export async function makeGeoprocessingHandler(
  options: GPOptions,
  interactive = true,
  basePath = "./"
) {
  const spinner = interactive
    ? ora("Creating new geoprocessing handler").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);
  // copy geoprocessing function template
  // rename metadata in function definition
  const projectFunctionPath = getProjectFunctionPath(basePath);
  const functionTemplatePath = `${getBaseFunctionPath()}`;
  const handlerCode = await fs.readFile(`${functionTemplatePath}/area.ts`);
  const testSmokeCode = await fs.readFile(
    `${functionTemplatePath}/areaSmoke.test.ts`
  );
  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "functions"))) {
    fs.mkdirSync(path.join(basePath, "src", "functions"));
  }
  await fs.writeFile(
    `${projectFunctionPath}/${options.title}.ts`,
    handlerCode
      .toString()
      .replace(/calculateArea/g, options.title)
      .replace(
        /CalculateArea/g,
        options.title.slice(0, 1).toUpperCase() + options.title.slice(1)
      )
      .replace(/functionName/g, options.title)
      .replace(`"async"`, `"${options.executionMode}"`)
      .replace("Function description", options.description)
  );
  await fs.writeFile(
    `${projectFunctionPath}/${options.title}Smoke.test.ts`,
    testSmokeCode
      .toString()
      .replace(/calculateArea/g, options.title)
      .replace("./area", `./${options.title}`)
  );
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

  spinner.succeed(
    `created ${options.title} function in ${projectFunctionPath}/`
  );
  if (interactive) {
    console.log(chalk.blue(`\nGeoprocessing function initialized`));
    console.log(`\nNext Steps:
    * Update your function definition in ${`${projectFunctionPath}/${options.title}.ts`}
    * Test cases go in ${`${projectFunctionPath}/${options.title}.test.ts`}
    * Populate examples/sketches
  `);
  }
}

export async function makePreprocessingHandler(
  options: PreprocessingOptions,
  interactive = true,
  basePath = "./"
) {
  const spinner = interactive
    ? ora("Creating new preprocessing handler").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);
  // copy preprocessing function template
  const projectFunctionPath = getProjectFunctionPath(basePath);
  // rename metadata in function definition
  const baseFunctionPath = getBaseFunctionPath();
  const handlerCode = await fs.readFile(
    `${baseFunctionPath}/clipToOceanEez.ts`
  );
  const testCode = await fs.readFile(
    `${baseFunctionPath}/clipToOceanEezSmoke.test.ts`
  );

  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "functions"))) {
    fs.mkdirSync(path.join(basePath, "src", "functions"));
  }
  // add optional eez clip, unquoting the json string before insertion
  await fs.writeFile(
    `${projectFunctionPath}/${options.title}.ts`,
    handlerCode
      .toString()
      .replace(/clipToOceanEez/g, options.title)
      .replace("Example-description", options.description)
      .replace(
        "EEZ_CLIP_OPERATION,",
        options.clipToEez !== "no"
          ? JSON.stringify(
              {
                datasourceId: "global-clipping-eez-land-union",
                operation: "intersection",
                options: {
                  propertyFilter: {
                    property: "UNION",
                    values: [options.eez],
                  },
                },
              },
              null,
              2
            ).replace(/"([^"]+)":/g, "$1:")
          : ""
      )
  );
  await fs.writeFile(
    `${projectFunctionPath}/${options.title}Smoke.test.ts`,
    testCode.toString().replace(/clipToOceanEez/g, options.title)
  );
  const geoprocessingJson = JSON.parse(
    fs.readFileSync(path.join(basePath, "geoprocessing.json")).toString()
  ) as GeoprocessingJsonConfig;
  geoprocessingJson.preprocessingFunctions =
    geoprocessingJson.preprocessingFunctions || [];
  geoprocessingJson.preprocessingFunctions.push(
    `src/functions/${options.title}.ts`
  );
  fs.writeFileSync(
    path.join(basePath, "geoprocessing.json"),
    JSON.stringify(geoprocessingJson, null, "  ")
  );

  spinner.succeed(
    `created ${options.title} function in ${projectFunctionPath}/`
  );
  if (interactive) {
    console.log(chalk.blue(`\nPreprocessing function initialized`));
    console.log(`\nNext Steps:
    * Update your function definition in ${`${projectFunctionPath}/${options.title}.ts`}
    * Test cases go in ${`${projectFunctionPath}/${options.title}.test.ts`}
    * Populate examples/functions
  `);
  }
}

export { createFunction };

interface GPOptions {
  title: string;
  executionMode: ExecutionMode;
  description: string;
}

interface PreprocessingOptions {
  title: string;
  description: string;
  clipToEez: "yes" | "no";
  eez: string;
}

import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { ExecutionMode } from "../../src/types";
import camelcase from "camelcase";

async function createFunction() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Title for this function, in camelCase",
      validate: value =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: value => camelcase(value)
    },
    {
      type: "input",
      name: "description",
      message: "Describe what this function does"
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Use typescript? (Recommended)"
    },
    {
      type: "confirm",
      name: "docker",
      default: false,
      message: "Is this a Dockerfile-based analysis?"
    },
    {
      type: "list",
      name: "executionMode",
      message: "Choose an execution mode",
      default: 0,
      when: answers => (answers.docker ? false : true),
      choices: [
        {
          value: "sync",
          name: "Sync - Best for quick analyses (< 2s)"
        },
        {
          value: "async",
          name: "Async - Better for long-running processes"
        }
      ]
    }
  ]);
  if (answers.docker) {
    answers.executionMode = "async";
  }
  answers.title = camelcase(answers.title);
  await makeGeoprocessingHandler(answers, true, "");
}

if (require.main === module) {
  createFunction();
}

export async function makeGeoprocessingHandler(
  options: GPOptions,
  interactive = true,
  basePath = "./"
) {
  if (options.docker) {
    throw new Error("Docker container handlers are not yet supported");
  }
  if (options.executionMode === "async") {
    throw new Error("Async execution mode is not yet supported");
  }
  const spinner = interactive
    ? ora("Creating new project").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);
  // copy geoprocessing function template
  const fpath = basePath + "src/functions";
  // rename metadata in function definition
  const templatePath = /dist/.test(__dirname)
    ? `${__dirname}/../../../templates/functions`
    : `${__dirname}/../../../templates/functions`;
  const handlerCode = await fs.readFile(`${templatePath}/area.ts`);
  const testCode = await fs.readFile(`${templatePath}/area.test.ts`);
  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "functions"))) {
    fs.mkdirSync(path.join(basePath, "src", "functions"));
  }
  await fs.writeFile(
    `${fpath}/${options.title}.ts`,
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
    `${fpath}/${options.title}.test.ts`,
    testCode
      .toString()
      .replace(/calculateArea/g, options.title)
      .replace("./area", `./${options.title}`)
  );
  const geoprocessingJson = JSON.parse(
    fs.readFileSync(path.join(basePath, "geoprocessing.json")).toString()
  );
  geoprocessingJson.functions = geoprocessingJson.functions || [];
  geoprocessingJson.functions.push(`src/functions/${options.title}.ts`);
  fs.writeFileSync(
    path.join(basePath, "geoprocessing.json"),
    JSON.stringify(geoprocessingJson, null, "  ")
  );
  // TODO: make typescript optional
  spinner.succeed(`created ${options.title} function in ${fpath}/`);
  if (interactive) {
    console.log(chalk.blue(`\nGeoprocessing function initialized`));
    console.log(`\nNext Steps:
    * Update your function definition in ${`${fpath}/${options.title}.ts`}
    * Test cases go in ${`${fpath}/${options.title}.test.ts`}
    * Populate examples/sketches
  `);
  }
}

export { createFunction };

interface GPOptions {
  title: string;
  typescript: boolean;
  docker: boolean;
  executionMode: ExecutionMode;
  description: string;
}

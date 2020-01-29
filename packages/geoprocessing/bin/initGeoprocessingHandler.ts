#!/usr/bin/env node
import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { ExecutionMode } from "../src/types";
import camelcase from "camelcase";

if (require.main === module) {
  (async () => {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Title for this function, in camelCase",
        validate: value =>
          /^\w+$/.test(value)
            ? true
            : "Please use only alphabetical characters",
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
    makeGeoprocessingHandler(answers, true, "");
  })();
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
  const path = basePath + "/src/handlers";
  // rename metadata in function definition
  const templatePath = /dist/.test(__dirname)
    ? `${__dirname}/../../templates/geoprocessing`
    : `${__dirname}/../templates/geoprocessing`;
  const handlerCode = await fs.readFile(`${templatePath}/area.ts`);
  const testCode = await fs.readFile(`${templatePath}/area.test.ts`);
  await fs.writeFile(
    `${path}/${options.title}.ts`,
    handlerCode
      .toString()
      .replace(/calculateArea/g, options.title)
      .replace(
        /CalculateArea/g,
        options.title.slice(0, 1).toUpperCase() + options.title.slice(1)
      )
      .replace(/functionName/g, options.title)
      .replace(`"sync"`, `"${options.executionMode}"`)
      .replace("Function description", options.description)
  );
  await fs.writeFile(
    `${path}/${options.title}.test.ts`,
    testCode.toString().replace(/calculateArea/g, options.title)
  );
  // TODO: make typescript optional
  spinner.succeed(`created ${options.title} function in ${path}/`);
  if (interactive) {
    console.log(chalk.blue(`\nGeoprocessing function initialized`));
    console.log(`\nNext Steps:
    * Update your function definition in ${`${path}/${options.title}.ts`}
    * Test cases go in ${`${path}/${options.title}.test.ts`}
    * Populate examples/sketches
  `);
  }
}

interface GPOptions {
  title: string;
  typescript: boolean;
  docker: boolean;
  executionMode: ExecutionMode;
  description: string;
}

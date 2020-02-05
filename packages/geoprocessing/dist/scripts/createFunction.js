"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const camelcase_1 = __importDefault(require("camelcase"));
async function createFunction() {
  const answers = await inquirer_1.default.prompt([
    {
      type: "input",
      name: "title",
      message: "Title for this function, in camelCase",
      validate: value =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: value => camelcase_1.default(value)
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
  answers.title = camelcase_1.default(answers.title);
  await makeGeoprocessingHandler(answers, true, "");
}
exports.createFunction = createFunction;
if (require.main === module) {
  createFunction();
}
async function makeGeoprocessingHandler(
  options,
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
    ? ora_1.default("Creating new project").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);
  // copy geoprocessing function template
  const path = basePath + "src/functions";
  // rename metadata in function definition
  const templatePath = /dist/.test(__dirname)
    ? `${__dirname}/../../../templates/functions`
    : `${__dirname}/../templates/functions`;
  const handlerCode = await fs_extra_1.default.readFile(
    `${templatePath}/area.ts`
  );
  const testCode = await fs_extra_1.default.readFile(
    `${templatePath}/area.test.ts`
  );
  await fs_extra_1.default.writeFile(
    `${path}/${options.title}.ts`,
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
  await fs_extra_1.default.writeFile(
    `${path}/${options.title}.test.ts`,
    testCode
      .toString()
      .replace(/calculateArea/g, options.title)
      .replace("./area", `./${options.title}`)
  );
  // TODO: make typescript optional
  spinner.succeed(`created ${options.title} function in ${path}/`);
  if (interactive) {
    console.log(chalk_1.default.blue(`\nGeoprocessing function initialized`));
    console.log(`\nNext Steps:
    * Update your function definition in ${`${path}/${options.title}.ts`}
    * Test cases go in ${`${path}/${options.title}.test.ts`}
    * Populate examples/sketches
  `);
  }
}
exports.makeGeoprocessingHandler = makeGeoprocessingHandler;
//# sourceMappingURL=createFunction.js.map

import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "node:path";
import chalk from "chalk";
import camelcase from "camelcase";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import pascalcase from "pascalcase";
import { getBlankProjectPath } from "../util/getPaths.js";
import { pathToFileURL } from "node:url";

async function createClient() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Name for this , in PascalCase (e.g. CoralReefCard",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: (value) => pascalcase(value),
    },
    {
      type: "input",
      name: "description",
      message: "Describe what this client is for",
    },
    {
      type: "input",
      name: "functionName",
      message:
        "What is the name of geoprocessing function this client will invoke? (in camelCase)",
      default: "simpleFunction",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: (value) => camelcase(value),
    },
  ]);
  answers.title = pascalcase(answers.title);
  await makeClient(answers, true, "");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // module was not imported but called directly
  await createClient();
}

export async function makeClient(
  options: ClientOptions,
  interactive = true,
  basePath = "./",
) {
  const spinner = interactive
    ? ora("Creating new client").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating client from templates`);

  const projectClientPath = basePath + "src/clients";
  const projectComponentPath = basePath + "src/components";

  const templatePath = getBlankProjectPath();
  const templateClientPath = `${templatePath}/src/clients`;
  const templateComponentPath = `${templatePath}/src/components`;

  // Make sure project folders exist
  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "clients"))) {
    fs.mkdirSync(path.join(basePath, "src", "clients"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "components"))) {
    fs.mkdirSync(path.join(basePath, "src", "components"));
  }

  // REPORT CLIENT

  // Read in top-level client files from template folder
  const clientCode = await fs.readFile(
    `${templateClientPath}/SimpleReport.tsx`,
  );
  const testClientCode = await fs.readFile(
    `${templateClientPath}/SimpleReport.example-stories.ts`,
  );

  // Add client to geoprocessing.json
  const geoprocessingJson = JSON.parse(
    fs
      .readFileSync(path.join(basePath, "project", "geoprocessing.json"))
      .toString(),
  ) as GeoprocessingJsonConfig;
  geoprocessingJson.clients = geoprocessingJson.clients || [];
  geoprocessingJson.clients.push({
    name: options.title,
    description: options.description,
    source: `src/clients/${options.title}.tsx`,
  });
  fs.writeFileSync(
    path.join(basePath, "project", "geoprocessing.json"),
    JSON.stringify(geoprocessingJson, null, "  "),
  );

  // Swap user-provided metadata into client files
  const functions = geoprocessingJson.geoprocessingFunctions;
  let functionName = "simpleFunction";

  if (options.functionName) {
    functionName = options.functionName; // expected to be in geoprocessing.json
  } else if (functions && functions.length) {
    functionName = path.basename(functions[0]).split(".")[0];
  }

  await fs.writeFile(
    `${projectClientPath}/${options.title}.tsx`,
    clientCode
      .toString()
      .replaceAll("SimpleReport", options.title)
      .replaceAll("SimpleCard", `${options.title}Card`),
  );

  await fs.writeFile(
    `${projectClientPath}/${options.title}.example-stories.ts`,
    testClientCode.toString().replaceAll("SimpleReport", options.title),
  );

  // CARD COMPONENT

  // Read in card component files from template folder
  const componentCode = await fs.readFile(
    `${templateComponentPath}/SimpleCard.tsx`,
  );
  const testComponentCode = await fs.readFile(
    `${templateComponentPath}/SimpleCard.stories.tsx`,
  );

  // Swap user-provided metadata into card component files

  await fs.writeFile(
    `${projectComponentPath}/${options.title}Card.tsx`,
    componentCode
      .toString()
      .replaceAll("SimpleCard", `${options.title}Card`)
      .replace(`"simpleFunction"`, `"${functionName}"`)
      .replace(`functions/simpleFunction`, `functions/${functionName}`),
  );

  await fs.writeFile(
    `${projectComponentPath}/${options.title}Card.stories.tsx`,
    testComponentCode
      .toString()
      .replaceAll("SimpleCard", `${options.title}Card`)
      .replace(`"simpleFunction"`, `"${functionName}"`),
  );

  spinner.succeed(`created ${options.title} client in ${projectClientPath}/`);
  if (interactive) {
    console.log(chalk.blue(`\nGeoprocessing client initialized`));
    console.log(`\nNext Steps:
    * Update your report client in ${`${projectClientPath}/${options.title}.tsx`} and ${`${projectComponentPath}/${options.title}Card.tsx`}
    * View your report client using 'npm run storybook' with smoke test output for all geoprocessing functions
  `);
  }
}

export { createClient };

interface ClientOptions {
  title: string;
  description: string;
  /** The geoprocessing function to run for this Client */
  functionName?: string;
}

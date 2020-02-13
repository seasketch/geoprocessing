import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import pascalcase from "pascalcase";

async function createClient() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Name for this function, in PascalCase",
      validate: value =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: value => pascalcase(value)
    },
    {
      type: "input",
      name: "description",
      message: "Describe what this client is for"
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Use typescript? (Recommended)"
    }
  ]);
  answers.title = pascalcase(answers.title);
  await makeClient(answers, true, "");
}

if (require.main === module) {
  createClient();
}

export async function makeClient(
  options: ClientOptions,
  interactive = true,
  basePath = "./"
) {
  const spinner = interactive
    ? ora("Creating new client").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating client from templates`);
  // copy client template
  const fpath = basePath + "src/clients";
  // rename metadata in function definition
  const templatePath = /dist/.test(__dirname)
    ? `${__dirname}/../../../templates/clients`
    : `${__dirname}/../../../templates/clients`;
  const clientCode = await fs.readFile(`${templatePath}/Client.ts`);
  const testCode = await fs.readFile(`${templatePath}/Client.test.ts`);
  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "clients"))) {
    fs.mkdirSync(path.join(basePath, "src", "clients"));
  }
  const geoprocessingJson = JSON.parse(
    fs.readFileSync(path.join(basePath, "geoprocessing.json")).toString()
  );
  geoprocessingJson.clients = geoprocessingJson.clients || [];
  geoprocessingJson.clients.push({
    name: options.title,
    description: options.description,
    source: `${fpath}/${options.title}.ts`
  });
  fs.writeFileSync(
    path.join(basePath, "geoprocessing.json"),
    JSON.stringify(geoprocessingJson)
  );
  const functions = geoprocessingJson.functions;
  let functionName = "area";
  if (functions.length) {
    functionName = path.basename(functions[0]).split(".")[0];
  }
  const resultsType = pascalcase(`${functionName} results`);
  await fs.writeFile(
    `${fpath}/${options.title}.tsx`,
    clientCode
      .toString()
      .replace(/Client/g, options.title)
      .replace(/AreaResults/g, resultsType)
      .replace(`"area"`, functionName)
  );
  await fs.writeFile(
    `${fpath}/${options.title}.stories.tsx`,
    testCode.toString().replace(/Client/g, options.title)
  );
  // TODO: make typescript optional
  spinner.succeed(`created ${options.title} client in ${fpath}/`);
  if (interactive) {
    console.log(chalk.blue(`\nGeoprocessing client initialized`));
    console.log(`\nNext Steps:
    * Update your client definition in ${`${fpath}/${options.title}.tsx`}
  `);
  }
}

export { createClient };

interface ClientOptions {
  title: string;
  typescript: boolean;
  description: string;
}

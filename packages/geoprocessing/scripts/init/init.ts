import inquirer from "inquirer";
//@ts-ignore
import licenses from "spdx-license-ids";
import fuzzy from "fuzzy";
//@ts-ignore
import autocomplete from "inquirer-autocomplete-prompt";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { join } from "path";
//@ts-ignore
import awsRegions from "aws-regions";
import util from "util";
import {
  ChooseTemplateOption,
  getTemplateQuestion,
  copyTemplates,
} from "../template/addTemplate";
const exec = util.promisify(require("child_process").exec);

const regions = awsRegions.list({ public: true }).map((v) => v.code);

inquirer.registerPrompt("autocomplete", autocomplete);
const licenseDefaults = ["MIT", "UNLICENSED", "BSD-3-Clause", "APACHE-2.0"];
const allLicenseOptions = [...licenses, "UNLICENSED"];

interface CreateProjectMetadata extends ChooseTemplateOption {
  name: string;
  description: string;
  author: string;
  email?: string;
  organization?: string;
  license: string;
  repositoryUrl: string;
  region: string;
  gpVersion?: string;
}

async function init(gpVersion?: string) {
  const userMeta = require("user-meta");
  const defaultName = userMeta.name;
  const defaultEmail = userMeta.email;
  const templateQuestion = await getTemplateQuestion();
  const packageAnswers = await inquirer.prompt<CreateProjectMetadata>([
    /* Pass your questions in here */
    {
      type: "input",
      name: "name",
      message: "Choose a name for your project",
      validate: (value) => {
        if (/^[a-z\-]+$/.test(value)) {
          return true;
        } else {
          return "Input must be lowercase and contain no spaces";
        }
      },
    },
    {
      type: "input",
      name: "description",
      message: "Please provide a short description of this project",
    },
    {
      type: "input",
      name: "repositoryUrl",
      message: "Source code repository location",
      validate: (value) =>
        value === "" ||
        value === null ||
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(
          value
        )
          ? true
          : "Must be a valid url",
    },
    {
      type: "input",
      name: "author",
      message: "Your name",
      default: defaultName,
      validate: (value) =>
        /\w+/.test(value)
          ? true
          : "Please provide a name for use in your package.json file",
    },
    {
      type: "input",
      name: "email",
      message: "Your email",
      default: defaultEmail,
      validate: (value) =>
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(value)
          ? true
          : "Please provide a valid email for use in your package.json file",
    },
    {
      type: "input",
      name: "organization",
      message: "Organization name (optional)",
    },
    {
      type: "autocomplete",
      name: "license",
      message: "Choose a license.",
      default: "MIT",
      source: async (answersSoFar: any, value: string) => {
        if (value) {
          return fuzzy.filter(value, allLicenseOptions).map((v) => v.original);
        } else {
          return licenseDefaults;
        }
      },
    },
    {
      type: "autocomplete",
      name: "region",
      message: "What AWS region would you like to deploy functions in?",
      default: "us-west-1",
      source: async (answersSoFar: any, value: string) => {
        if (value) {
          return fuzzy.filter(value, regions).map((v) => v);
        } else {
          return regions;
        }
      },
    },
    templateQuestion,
  ]);

  packageAnswers.gpVersion = gpVersion;

  await makeProject(packageAnswers);
}

if (require.main === module) {
  init();
}

export interface Package {
  name: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  bugs?: {
    url: string;
  };
  repository?: {
    type: "git";
    url: string;
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function makeProject(
  metadata: CreateProjectMetadata,
  interactive = true,
  basePath = ""
) {
  const {
    organization,
    region,
    email,
    gpVersion,
    ...packageJSONOptions
  } = metadata;
  const spinner = interactive
    ? ora("Creating new project").start()
    : {
        start: () => false,
        stop: () => false,
        succeed: () => false,
        fail: () => false,
      };
  const path = `${basePath ? basePath + "/" : ""}${metadata.name}`;
  spinner.start(`creating ${path}`);
  await fs.mkdir(path);
  spinner.succeed(`created ${path}/`);
  spinner.start("copying template");

  const gpPath = /dist/.test(__dirname)
    ? `${__dirname}/../../..`
    : `${__dirname}/..`;
  const templatePath = `${gpPath}/templates/project`;

  // Get version of geoprocessing currently running
  const curGpVersion: Package = JSON.parse(
    fs.readFileSync(`${gpPath}/package.json`).toString()
  ).version;

  await fs.copy(templatePath, path);

  spinner.succeed("copied base files");
  spinner.start("updating package.json with provided details");
  const packageJSON: Package = {
    ...JSON.parse(fs.readFileSync(`${templatePath}/package.json`).toString()),
    ...packageJSONOptions,
    // TODO: other repo types
    ...(/github/.test(metadata.repositoryUrl)
      ? {
          repository: {
            type: "git",
            url: "git+" + metadata.repositoryUrl + ".git",
          },
          homepage: metadata.repositoryUrl + "#readme",
          bugs: {
            url: metadata.repositoryUrl + "/issues",
          },
        }
      : {}),
  };
  await fs.writeFile(
    `${path}/package.json`,
    JSON.stringify(packageJSON, null, "  ")
  );
  spinner.succeed("updated package.json");
  spinner.start("creating geoprocessing.json");
  const author = email ? `${metadata.author} <${email}>` : metadata.author;
  await fs.writeFile(
    `${path}/geoprocessing.json`,
    JSON.stringify(
      {
        author,
        organization: organization || "",
        region,
      },
      null,
      "  "
    )
  );
  spinner.succeed("created geoprocessing.json");

  spinner.start("add .gitignore");
  try {
    await fs.move(join(path, "_gitignore"), join(path, ".gitignore")); // Move _gitignore to .gitignore
    spinner.succeed("added .gitignore");
  } catch (error) {
    spinner.fail(".gitignore add failed");
    console.error(error);
  }

  const readmePath = `${path}/data/README.md`;
  const readmeContents = await fs.readFile(readmePath);
  await fs.writeFile(
    readmePath,
    readmeContents.toString().replace(/replace-me/g, metadata.name)
  );
  await fs.copyFile(
    `${__dirname}/../../../templates/exampleSketch.json`,
    path + "/examples/sketches/sketch.json"
  );
  await fs.mkdir(`${path}/data/src`);
  await fs.mkdir(`${path}/data/dist`);

  if (metadata.templates.length > 0) {
    copyTemplates(metadata.templates, {
      skipInstall: true,
      projectPath: `./${metadata.name}`,
    });
  }

  // Install dependencies including adding GP.
  if (interactive) {
    spinner.start("installing dependencies with npm");
    const gpPkgString = gpVersion
      ? gpVersion
      : `@seasketch/geoprocessing@${curGpVersion}`;
    const { stderr, stdout, error } = await exec(
      `npm install --save-dev --save-exact ${gpPkgString}`,
      {
        cwd: metadata.name,
      }
    );
    if (error) {
      console.log(error);
      process.exit();
    }
    spinner.succeed("installed dependencies!");
  }
  if (interactive) {
    console.log(
      chalk.blue(`\nYour geoprocessing project has been initialized!`)
    );
    console.log(`\nNext Steps:
  * Look at README.md for some tips on working with this project
  * ${chalk.yellow(
    `npm run create:function`
  )} to create your first geoprocessing function
  * ${chalk.yellow(`npm run create:client`)} to add a new report client
`);
    console.log(`Tips:
  * Create examples in SeaSketch, then export them as GeoJSON to ./examples/sketches for use in test cases and when designing reports
  * The data/ directory is where you can store scripts for generating data products you'll use in geoprocessing functions. It's already setup with some useful Docker containers.
`);
  }
}

export default makeProject;
export { init };

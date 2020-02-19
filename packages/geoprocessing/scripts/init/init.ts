import inquirer from "inquirer";
//@ts-ignore
import { name as defaultName, email as defaultEmail } from "user-meta";
//@ts-ignore
import licenses from "spdx-license-ids";
import fuzzy from "fuzzy";
//@ts-ignore
import autocomplete from "inquirer-autocomplete-prompt";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
//@ts-ignore
import awsRegions from "aws-regions";
import util from "util";
const exec = util.promisify(require("child_process").exec);

//@ts-ignore
const regions = awsRegions.list({ public: true }).map(v => v.code);

inquirer.registerPrompt("autocomplete", autocomplete);
const licenseDefaults = ["MIT", "UNLICENSED", "BSD-3-Clause", "APACHE-2.0"];
const allLicenseOptions = [...licenses, "UNLICENSED"];

async function init() {
  const packageAnswers = await inquirer.prompt([
    /* Pass your questions in here */
    {
      type: "input",
      name: "name",
      message: "Choose a name for your project",
      validate: value => {
        if (/^[a-z\-]+$/.test(value)) {
          return true;
        } else {
          return "Input must be lowercase and contain no spaces";
        }
      }
    },
    {
      type: "input",
      name: "description",
      message: "Please provide a short description of this project"
    },
    {
      type: "input",
      name: "repositoryUrl",
      message: "Source code repository location",
      validate: value =>
        value === "" ||
        value === null ||
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(
          value
        )
          ? true
          : "Must be a valid url"
    },
    {
      type: "input",
      name: "author",
      message: "Your name",
      default: defaultName,
      validate: value =>
        /\w+/.test(value)
          ? true
          : "Please provide a name for use in your package.json file"
    },
    {
      type: "input",
      name: "email",
      message: "Your email",
      default: defaultEmail,
      validate: value =>
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(value)
          ? true
          : "Please provide a valid email for use in your package.json file"
    },
    {
      type: "input",
      name: "organization",
      message: "Organization name (optional)"
    },
    {
      type: "autocomplete",
      name: "license",
      message: "Choose a license.",
      default: "MIT",
      source: async (answersSoFar: any, value: string) => {
        if (value) {
          return fuzzy.filter(value, allLicenseOptions).map(v => v.original);
        } else {
          return licenseDefaults;
        }
      }
    },
    {
      type: "autocomplete",
      name: "region",
      message: "What AWS region would you like to deploy functions in?",
      default: "us-west-1",
      source: async (answersSoFar: any, value: string) => {
        if (value) {
          return fuzzy.filter(value, regions).map(v => v);
        } else {
          return regions;
        }
      }
    }
  ]);

  await makeProject(packageAnswers);
}

if (require.main === module) {
  init();
}

interface Package {
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
}

interface ProjectMetadataOptions {
  name: string;
  description: string;
  author: string;
  email?: string;
  organization?: string;
  license: string;
  repositoryUrl: string;
  region: string;
}

async function makeProject(
  metadata: ProjectMetadataOptions,
  interactive = true,
  basePath = ""
) {
  const { organization, region, email, ...packageJSONOptions } = metadata;
  const spinner = interactive
    ? ora("Creating new project").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  const path = `${basePath ? basePath + "/" : ""}${metadata.name}`;
  spinner.start(`creating ${path}`);
  await fs.mkdir(path);
  spinner.succeed(`created ${path}/`);
  spinner.start("copying template");

  const templatePath = /dist/.test(__dirname)
    ? `${__dirname}/../../../templates/project`
    : `${__dirname}/../templates/project`;
  await fs.copy(templatePath, path);
  spinner.succeed("copied template");
  spinner.start("updating package.json with provided details");
  const packageJSON: Package = {
    ...JSON.parse(fs.readFileSync(`${templatePath}/package.json`).toString()),
    ...packageJSONOptions,
    // TODO: other repo types
    ...(/github/.test(metadata.repositoryUrl)
      ? {
          repository: {
            type: "git",
            url: "git+" + metadata.repositoryUrl + ".git"
          },
          homepage: metadata.repositoryUrl + "#readme",
          bugs: {
            url: metadata.repositoryUrl + "/issues"
          }
        }
      : {})
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
        region
      },
      null,
      "  "
    )
  );
  spinner.succeed("created geoprocessing.json");
  spinner.start("updating Dockerfile");
  const dockerfilePath = `${path}/data/Dockerfile`;
  const dockerfileContents = await fs.readFile(dockerfilePath);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  await fs.writeFile(
    dockerfilePath,
    dockerfileContents
      .toString()
      .replace("Chad Burt <chad@underbluewaters.net>", author)
      .replace("America/Los_Angeles", tz)
  );
  spinner.succeed("updated Dockerfile");
  await fs.copyFile(
    `${__dirname}/../../../templates/exampleSketch.json`,
    path + "/examples/sketches/sketch.json"
  );
  if (interactive) {
    spinner.start("installing dependencies with npm");
    const { stderr, stdout, error } = await exec(
      "npm install --save-dev @seasketch/geoprocessing@latest",
      {
        cwd: metadata.name
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

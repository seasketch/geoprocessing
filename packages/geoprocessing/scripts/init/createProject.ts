import { TemplateMetadata, copyTemplates } from "../template/addTemplate";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { join } from "path";
import { Package } from "../types";

export interface CreateProjectMetadata extends TemplateMetadata {
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

export async function createProject(
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

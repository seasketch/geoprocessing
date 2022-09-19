import { TemplateMetadata, copyTemplates } from "../template/addTemplate";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { join } from "path";
import { Package } from "../../src/types";
import util from "util";
const exec = util.promisify(require("child_process").exec);

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

/** Create project at basePath.  If should be created non-interactively then set interactive = false and provide all project creation metadata, otherwise will prompt for answers  */
export async function createProject(
  metadata: CreateProjectMetadata,
  interactive = true,
  basePath = ""
) {
  const { organization, region, email, gpVersion, ...packageJSONOptions } =
    metadata;
  const spinner = interactive
    ? ora("Creating new project").start()
    : {
        start: () => false,
        stop: () => false,
        succeed: () => false,
        fail: () => false,
      };
  const projectPath = `${basePath ? basePath + "/" : ""}${metadata.name}`;
  spinner.start(`creating ${projectPath}`);
  await fs.ensureDir(projectPath);
  spinner.succeed(`created ${projectPath}/`);
  spinner.start("copying template");

  const gpPath = /dist/.test(__dirname)
    ? `${__dirname}/../../..`
    : `${__dirname}/../..`;
  const projectTemplatePath = `${gpPath}/templates/project`;

  // Get version of geoprocessing currently running
  const curGpPackage: Package = JSON.parse(
    fs.readFileSync(`${gpPath}/package.json`).toString()
  );
  const curGpVersion = curGpPackage.version;

  // Copy all files from base template
  await fs.copy(projectTemplatePath, projectPath);

  spinner.succeed("copied base files");
  spinner.start("updating package.json with provided details");
  const packageJSON: Package = {
    ...JSON.parse(
      fs.readFileSync(`${projectTemplatePath}/package.json`).toString()
    ),
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

  if (gpVersion) {
    if (packageJSON.devDependencies) {
      packageJSON.devDependencies["@seasketch/geoprocessing"] = gpVersion;
    } else {
      packageJSON.devDependencies = { "@seasketch/geoprocessing": gpVersion };
    }
    spinner.succeed(`Installing user-defined GP version ${gpVersion}`);
  } else {
    if (packageJSON.devDependencies) {
      packageJSON.devDependencies["@seasketch/geoprocessing"] = curGpVersion;
    } else {
      packageJSON.devDependencies = {
        "@seasketch/geoprocessing": curGpVersion,
      };
    }
  }

  await fs.writeFile(
    `${projectPath}/package.json`,
    JSON.stringify(packageJSON, null, "  ")
  );
  spinner.succeed("updated package.json");
  spinner.start("creating geoprocessing.json");
  const author = email ? `${metadata.author} <${email}>` : metadata.author;
  await fs.writeFile(
    `${projectPath}/geoprocessing.json`,
    JSON.stringify(
      {
        author,
        organization: organization || "",
        region,
        clients: [],
        preprocessingFunctions: [],
        geoprocessingFunctions: [],
      },
      null,
      "  "
    )
  );
  spinner.succeed("created geoprocessing.json");

  spinner.start("add .gitignore");
  try {
    await fs.move(
      join(projectPath, "_gitignore"),
      join(projectPath, ".gitignore")
    ); // Move _gitignore to .gitignore
    spinner.succeed("added .gitignore");
  } catch (error) {
    spinner.fail(".gitignore add failed");
    console.error(error);
  }

  const readmePath = `${projectPath}/data/README.md`;
  const readmeContents = await fs.readFile(readmePath);
  await fs.writeFile(
    readmePath,
    readmeContents.toString().replace(/replace-me/g, metadata.name)
  );
  await fs.copyFile(
    `${gpPath}/templates/exampleSketch.json`,
    projectPath + "/examples/sketches/sketch.json"
  );
  await fs.ensureDir(`${projectPath}/data/src`);
  await fs.ensureDir(`${projectPath}/data/dist`);

  if (metadata.templates.length > 0) {
    await copyTemplates(metadata.templates, {
      skipInstall: true,
      projectPath,
    });
  }

  // Install dependencies including adding GP.
  if (interactive) {
    spinner.start("installing dependencies with npm");
    const { stderr, stdout, error } = await exec(`npm install`, {
      cwd: metadata.name,
    });
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

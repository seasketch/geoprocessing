import { TemplateMetadata, copyTemplates } from "../template/addTemplate";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { join } from "path";
import { BBox, Package } from "../../src/types";
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
  bboxMinLng: number;
  bboxMaxLng: number;
  bboxMinLat: number;
  bboxMaxLat: number;
  noun: string;
  nounPossessive: string;
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

  // If running from project space, which runs gp code in dist build folder
  // then set gpPath to top-level of dist folder (3 folders up), where the templates folder is
  // else must be running gp code from src folder (like tests)
  // and should set gpPath to top-level of src (2 folders up)
  const gpPath = /dist/.test(__dirname)
    ? `${__dirname}/../../..`
    : `${__dirname}/../..`;
  const projectTemplatePath = `${gpPath}/templates/project`;

  // Get version of geoprocessing currently running
  const curGpPackage: Package = JSON.parse(
    fs.readFileSync(`${gpPath}/package.json`).toString()
  );
  const curGpVersion = curGpPackage.version;

  // Copy all files from base project template
  await fs.copy(projectTemplatePath, projectPath);
  spinner.succeed("copied base files");

  // Copy default project configuration
  await fs.copy(
    `${gpPath}/defaultProjectConfig/project`,
    projectPath + "/project"
  );
  spinner.succeed("copied default project configuration");

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

  spinner.start("updating basic.json");
  const basic = fs.readJSONSync(`${projectPath}/project/basic.json`);
  await fs.writeJSONSync(`${projectPath}/project/basic.json`, {
    ...basic,
    bbox: [
      metadata.bboxMinLng,
      metadata.bboxMinLat,
      metadata.bboxMaxLng,
      metadata.bboxMaxLat,
    ],
    noun: metadata.noun,
    nounPossessive: metadata.nounPossessive,
  });
  spinner.succeed("updated basic.json");

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

  await fs.copyFile(
    `${gpPath}/templates/exampleSketch.json`,
    projectPath + "/examples/sketches/sketch.json"
  );
  // recursively copy entire data/bin directory to project space
  await fs.copy(`${gpPath}/data/bin`, projectPath + "/data/bin");
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
  * ${chalk.yellow(
    `Tutorials`
  )} are availableto create your first geoprocessing function and report client at https://github.com/seasketch/geoprocessing/wiki/Tutorials
`);
  }
}

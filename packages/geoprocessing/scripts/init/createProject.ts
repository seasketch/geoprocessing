import { copyTemplates } from "../template/addTemplate.js";
import { TemplateMetadata } from "../types.js";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { BBox, Package, projectSchema } from "../../src/types/index.js";
import { promisify } from "node:util";
import { getGeoprocessingPath, getBaseProjectPath } from "../util/getPaths.js";
import { $ } from "zx";
import * as child from "node:child_process";

$.verbose = false;

const exec = promisify(child.exec);

export interface CreateProjectMetadata extends TemplateMetadata {
  name: string;
  description: string;
  author: string;
  email?: string;
  organization?: string;
  license: string;
  repositoryUrl: string;
  region: string;
  languages: string[];
  gpVersion?: string;
  /** @deprecated */
  bbox?: BBox;
  /** @deprecated */
  bboxMinLng?: number;
  /** @deprecated */
  bboxMaxLng?: number;
  /** @deprecated */
  bboxMinLat?: number;
  /** @deprecated */
  bboxMaxLat?: number;
  /** @deprecated */
  planningAreaType?: string;
  /** @deprecated */
  planningAreaId?: string;
  /** @deprecated */
  planningAreaName?: string;
  /** @deprecated */
  planningAreaNameQuestion?: string;
}

/** Create project at basePath.  If should be created non-interactively then set interactive = false and provide all project creation metadata, otherwise will prompt for answers  */
export async function createProject(
  metadata: CreateProjectMetadata,
  interactive = true,
  basePath = "",
) {
  const {
    organization,
    region,
    languages,
    email,
    gpVersion,
    name,
    description,
    author,
    license,
    repositoryUrl,
  } = metadata;

  // Installation path for new project
  const projectPath = `${basePath ? basePath + "/" : ""}${metadata.name}`;

  const spinner = interactive
    ? ora("Creating new project").start()
    : {
        start: () => false,
        stop: () => false,
        succeed: () => false,
        fail: () => false,
      };

  spinner.start(`creating ${projectPath}`);
  await fs.ensureDir(projectPath);
  spinner.succeed(`created ${projectPath}/`);
  spinner.start("copying base project");

  const baseProjectPath = getBaseProjectPath();

  // Get version of geoprocessing currently running
  const curGpPackage: Package = JSON.parse(
    fs.readFileSync(`${getGeoprocessingPath()}/package.json`).toString(),
  );
  const curGpVersion = curGpPackage.version;

  // Copy all files from base project template
  try {
    await fs.ensureDir(projectPath);
    await $`cp -r ${baseProjectPath}/* ${projectPath}`;
    await $`cp -r ${baseProjectPath}/. ${projectPath}`;
    await $`rm -f ${projectPath}/package-lock.json`;
    await $`rm -f ${projectPath}/project/geoprocessing.json`;
    await $`rm -rf ${projectPath}/examples/outputs/*.*`;
    await $`rm -rf ${projectPath}/examples/features/*.*`;
    await $`rm -rf ${projectPath}/examples/sketches/*/*`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Base project copy failed");
      throw error;
    }
  }
  spinner.succeed("copied base files");

  spinner.start("updating package.json with provided details");

  const packageJSON: Package = {
    ...JSON.parse(
      fs.readFileSync(`${baseProjectPath}/package.json`).toString(),
    ),
    name,
    version: "0.1.0",
    description,
    author,
    license,
    repositoryUrl,
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
    private: false,
  };

  if (gpVersion) {
    spinner.start(`Installing user-defined GP version ${gpVersion}`);
    packageJSON.dependencies!["@seasketch/geoprocessing"] = gpVersion;
    spinner.succeed(`Installing user-defined GP version ${gpVersion}`);
  } else {
    packageJSON.dependencies!["@seasketch/geoprocessing"] = curGpVersion;
  }

  await fs.writeFile(
    `${projectPath}/package.json`,
    JSON.stringify(packageJSON, null, 2),
  );

  spinner.succeed("updated package.json");

  spinner.start("creating geoprocessing.json");
  const geoAuthor = email ? `${metadata.author} <${email}>` : metadata.author;
  await fs.writeFile(
    `${projectPath}/project/geoprocessing.json`,
    JSON.stringify(
      {
        author: geoAuthor,
        organization: organization || "",
        region,
        clients: [],
        preprocessingFunctions: [],
        geoprocessingFunctions: [],
      },
      null,
      "  ",
    ),
  );
  spinner.succeed("created geoprocessing.json");

  spinner.start("updating basic.json");
  const basic = fs.readJSONSync(`${projectPath}/project/basic.json`);

  const validBasic = projectSchema.parse({
    ...basic,
    languages: ["EN", ...languages], // insert EN as required language
  });

  await fs.writeJSONSync(`${projectPath}/project/basic.json`, validBasic, {
    spaces: 2,
  });
  spinner.succeed("updated basic.json");

  spinner.start("add .gitignore");
  try {
    if (fs.existsSync(`${projectPath}/_gitignore`)) {
      fs.move(`${projectPath}/_gitignore`, `${projectPath}/.gitignore`);
    }
    spinner.succeed("added .gitignore");
  } catch (error) {
    spinner.fail(".gitignore add failed");
    console.error(error);
  }

  // recursively copy entire i18n directory to project space
  spinner.start("add i18n");
  await fs.copy(
    `${getGeoprocessingPath()}/src/i18n`,
    projectPath + "/src/i18n",
  );
  // Create i18n.json with project-specific config
  const configPath = `${projectPath}/project/i18n.json`;
  const i18nConfig = {
    localNamespace: "translation",
    remoteContext: packageJSON.name,
  };
  await fs.writeJSON(configPath, i18nConfig, { spaces: 2 });

  spinner.succeed("added i18n");

  if (metadata.templates.length > 0) {
    // Should always be a single name if single select question used
    const templateNames = Array.isArray(metadata.templates)
      ? metadata.templates
      : [metadata.templates];
    // We are adding a starter template
    await copyTemplates("starter-template", templateNames, {
      skipInstall: true,
      projectPath,
    });
  }

  // Install dependencies including adding GP.
  if (interactive) {
    spinner.start("installing dependencies with npm");

    try {
      await exec(`npm install`, {
        cwd: metadata.name,
      });
      spinner.succeed("installed dependencies");
      spinner.start("extracting translations");
      await exec(`npm run extract:translation`, {
        cwd: metadata.name,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        console.log(error.stack);
        process.exit();
      }
    }

    spinner.succeed("extracted initial translations");
  }
  if (interactive) {
    console.log(
      chalk.blue(`\nYour geoprocessing project has been initialized!`),
    );
    console.log(`\nNext Steps:
  * ${chalk.yellow(
    `Tutorials`,
  )} are available to create your first geoprocessing function and report client at https://github.com/seasketch/geoprocessing/wiki/Tutorials
  * ${chalk.yellow(
    `Translations`,
  )} need to be synced if you are using POEditor.  Make sure POEDITOR_PROJECT and POEDITOR_API_TOKEN environemnt variables are set in your shell environment and then run 'npm run sync:translation'.  See tutorials for more information
`);
  }
}

import { copyTemplates } from "../template/addTemplate.js";
import { TemplateMetadata } from "../types.js";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import {
  BBox,
  Geography,
  Package,
  projectSchema,
  geographiesSchema,
  datasourcesSchema,
} from "../../src/types/index.js";
import { promisify } from "node:util";
import { getGeoprocessingPath, getBaseProjectPath } from "../util/getPaths.js";
import { getBbox } from "../global/datasources/mr-eez.js";
import { $ } from "zx";
import { globalDatasources } from "../../src/datasources/global.js";
import { isVectorDatasource } from "../../src/index.js";
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
  planningAreaType: string;
  bbox?: BBox;
  bboxMinLng?: number;
  bboxMaxLng?: number;
  bboxMinLat?: number;
  bboxMaxLat?: number;
  planningAreaId: string;
  planningAreaName: string;
  planningAreaNameQuestion: string;
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

  console.log("gpVersion", gpVersion);
  console.log("packageJSON", packageJSON);

  if (gpVersion) {
    spinner.start(`Installing user-defined GP version ${gpVersion}`);
    packageJSON.dependencies!["@seasketch/geoprocessing"] = gpVersion;
    spinner.succeed(`Installing user-defined GP version ${gpVersion}`);
  } else {
    packageJSON.dependencies!["@seasketch/geoprocessing"] = curGpVersion;
  }

  await fs.writeFile(
    `${projectPath}/package.json`,
    JSON.stringify(packageJSON, null, "  "),
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

  // Either lookup bbox of planning area by name or construct from user-provided
  const bbox: BBox = await (async () => {
    if (metadata.planningAreaType && metadata.planningAreaType === "eez") {
      const bbox = await getBbox(metadata.planningAreaId);
      if (!bbox)
        throw new Error(`Bounding box not for EEZ named ${metadata.name}`);
      return bbox;
    } else {
      if (
        metadata.bboxMinLng === undefined ||
        metadata.bboxMinLat === undefined ||
        metadata.bboxMaxLng === undefined ||
        metadata.bboxMaxLat === undefined
      ) {
        throw new Error("Incomplete bounding box provided by user");
      }
      return [
        metadata.bboxMinLng,
        metadata.bboxMinLat,
        metadata.bboxMaxLng,
        metadata.bboxMaxLat,
      ] as BBox;
    }
  })();

  const validBasic = projectSchema.parse({
    ...basic,
    bbox,
    languages: ["EN", ...languages], // insert EN as required language
    planningAreaType: metadata.planningAreaType,
    planningAreaId: metadata.planningAreaId,
    planningAreaName: metadata.planningAreaName
      ? metadata.planningAreaName
      : metadata.planningAreaId,
  });

  await fs.writeJSONSync(`${projectPath}/project/basic.json`, validBasic, {
    spaces: 2,
  });
  spinner.succeed("updated basic.json");

  if (metadata.planningAreaType && metadata.planningAreaType === "eez") {
    const globalEezDS = "global-eez-mr-v12";
    const eezDs = globalDatasources.find(
      (ds) => ds.datasourceId === globalEezDS,
    );
    if (isVectorDatasource(eezDs)) {
      if (validBasic.planningAreaType === "eez") {
        spinner.start("updating geographies.json");
        // read default geographies and disable them by setting precalc to false
        // also clear default-boundary group
        const geos: Geography[] = geographiesSchema
          .parse(fs.readJSONSync(`${projectPath}/project/geographies.json`))
          .map((g) => ({ ...g, precalc: false, groups: [] }));
        // assign initial eez geography with proper filters and precalc true
        geos.push({
          geographyId: "eez",
          datasourceId: "global-eez-mr-v12",
          display: metadata.planningAreaName
            ? metadata.planningAreaName
            : metadata.planningAreaId,
          propertyFilter: {
            property: eezDs.idProperty!,
            values: [metadata.planningAreaId],
          },
          bboxFilter: validBasic.bbox,
          groups: ["default-boundary"],
          precalc: true,
        });
        await fs.writeJSONSync(
          `${projectPath}/project/geographies.json`,
          geos,
          {
            spaces: 2,
          },
        );
        spinner.succeed("updated geographies.json");

        spinner.start("updating eez in datasources.json");
        try {
          const ds = datasourcesSchema.parse(
            fs.readJSONSync(`${projectPath}/project/datasources.json`),
          );
          const eezIndex = ds.findIndex(
            (d) => d.datasourceId === "global-eez-mr-v12",
          );
          // Narrow the global eez datasource to the planning area and turn on precalc
          ds[eezIndex] = {
            ...ds[eezIndex],
            precalc: true,
            propertyFilter: {
              property: eezDs.idProperty!,
              values: [metadata.planningAreaId],
            },
            bboxFilter: validBasic.bbox,
          };
          await fs.writeJSONSync(
            `${projectPath}/project/datasources.json`,
            ds,
            {
              spaces: 2,
            },
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log("EEZ datasource update failed");
            throw error;
          }
        }
        spinner.succeed("updated eez in datasources.json");
      } else {
        // copy default world geography
        spinner.start("updating geographies.json");
        try {
          await fs.ensureDir(projectPath);
          await $`cp -r ${baseProjectPath}/project/geographies.json ${projectPath}/project/geographies.json`;
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log("Default geography copy failed");
            throw error;
          }
        }
        spinner.succeed("updated geographies.json");
      }
    } else {
      console.error(
        `Expected vector datasource for ${globalEezDS}, geographies.json not updated`,
      );
    }
  }

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

import { TemplateMetadata, copyTemplates } from "../template/addTemplate";
import ora from "ora";
import fs from "fs-extra";
import chalk from "chalk";
import { join } from "path";
import { BBox, Package, projectSchema } from "../../src/types";
import util from "util";
import { getGeoprocessingPath, getBaseProjectPath } from "../util/getPaths";
import { getEezCountryBbox } from "../datasources/eez_land_union_v3";
import { $ } from "zx";

$.verbose = false;

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
  planningAreaType: string;
  bbox?: BBox;
  bboxMinLng?: number;
  bboxMaxLng?: number;
  bboxMinLat?: number;
  bboxMaxLat?: number;
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
    fs.readFileSync(`${getGeoprocessingPath()}/package.json`).toString()
  );
  const curGpVersion = curGpPackage.version;

  // Copy all files from base project template
  try {
    await fs.ensureDir(projectPath);
    await $`cp -r ${baseProjectPath}/* ${projectPath}`;
    await $`cp -r ${baseProjectPath}/. ${projectPath}`;
    await $`rm ${projectPath}/package-lock.json`;
    await $`rm ${projectPath}/geoprocessing.json`;
    await $`rm ${projectPath}/examples/sketches/*.json`;
    await $`rm -rf ${projectPath}/examples/output`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Base project copy failed");
      throw err;
    }
  }
  spinner.succeed("copied base files");

  spinner.start("updating package.json with provided details");

  const packageJSON: Package = {
    ...JSON.parse(
      fs.readFileSync(`${baseProjectPath}/package.json`).toString()
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
    ...{ private: false },
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

  // Add smoke tests to default run
  if (process.env.NODE_ENV !== "test") {
    await fs.writeFile(
      `${projectPath}/package.json`,
      fs
        .readFileSync(`${projectPath}/package.json`)
        .toString()
        .replace("npm run test:unit", "npm run test:unit && npm run test:smoke")
    );
  }
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

  // Either lookup bbox of planning area by name or construct from user-provided
  const bbox: BBox = await (async () => {
    if (metadata.planningAreaType && metadata.planningAreaType === "eez") {
      const bbox = await getEezCountryBbox(metadata.noun);
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
      ];
    }
  })();

  const validBasic = projectSchema.parse({
    ...basic,
    bbox,
    planningAreaType: metadata.planningAreaType,
    noun: metadata.noun,
    nounPossessive: metadata.nounPossessive,
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

  // recursively copy entire data/bin directory to project space
  await fs.copy(
    `${getGeoprocessingPath()}/data/bin`,
    projectPath + "/data/bin"
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
  * ${chalk.yellow(
    `Tutorials`
  )} are available to create your first geoprocessing function and report client at https://github.com/seasketch/geoprocessing/wiki/Tutorials
`);
  }
}

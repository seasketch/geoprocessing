import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { Package } from "./init";
import util from "util";
const exec = util.promisify(require("child_process").exec);

interface TemplateOptions {
  name: string;
}

async function addTemplate() {
  // TODO: generate list by reading list of packages with keyword 'template'
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "name",
      message: "Choose a template",
      choices: [
        {
          value: "gp-clip",
          name:
            "Global clipping preprocessor - Erases portion of sketch overlapping with land or extending into ocean outsize EEZ boundary",
        },
      ],
    },
  ]);

  if (answers.name) {
    try {
      await copyTemplate(answers.name);
    } catch (error) {
      console.error(error);
      process.exit();
    }
  }
}

if (require.main === module) {
  addTemplate();
}

async function copyTemplate(
  name: string,
  interactive = true,
  projectPath = ".",
  skipInstall = false // skip if being called by another command that will run install later
) {
  const templatePath = /dist/.test(__dirname)
    ? path.join(__dirname, "..", "..", "..", "..", name)
    : path.join(__dirname, "..", "..", name);

  if (!fs.existsSync(templatePath)) {
    console.error(`Could not find template ${name} ${templatePath}`);
  }

  // console.log("you are here:", process.cwd());
  // console.log("base path:", projectPath);

  const spinner = interactive
    ? ora("Adding template").start()
    : { start: () => false, stop: () => false, succeed: () => false };

  // Copy package metadata

  spinner.start("adding template dependenceis");
  const templatePackage: Package = JSON.parse(
    fs.readFileSync(`${templatePath}/package.json`).toString()
  );
  const projectPackage: Package = JSON.parse(
    fs.readFileSync(`${projectPath}/package.json`).toString()
  );
  const packageJSON: Package = {
    ...projectPackage,
    dependencies: {
      ...(projectPackage?.dependencies || {}),
      ...(templatePackage?.dependencies || {}),
    },
    devDependencies: {
      ...(projectPackage?.devDependencies || {}),
      ...(templatePackage?.devDependencies || {}),
    },
  };

  await fs.writeFile(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJSON, null, "  ")
  );
  spinner.succeed("added template dependencies");

  // Copy file assets, but only if there is something to copy. Creates directories first as needed

  spinner.start("copying template files");
  try {
    if (!fs.existsSync(path.join(projectPath, "src"))) {
      fs.mkdirSync(path.join(projectPath, "src"));
    }

    if (fs.existsSync(path.join(templatePath, "src", "functions"))) {
      if (!fs.existsSync(path.join(projectPath, "src", "functions"))) {
        fs.mkdirSync(path.join(projectPath, "src", "functions"));
      }
      await fs.copy(
        path.join(templatePath, "src", "functions"),
        path.join(projectPath, "src", "functions")
      );
    }

    if (fs.existsSync(path.join(templatePath, "src", "clients"))) {
      if (!fs.existsSync(path.join(projectPath, "src", "clients"))) {
        fs.mkdirSync(path.join(projectPath, "src", "clients"));
      }
      await fs.copy(
        path.join(templatePath, "src", "clients"),
        path.join(projectPath, "src", "clients")
      );
    }

    if (fs.existsSync(path.join(templatePath, "examples"))) {
      if (!fs.existsSync(path.join(projectPath, "examples"))) {
        fs.mkdirSync(path.join(projectPath, "examples"));
      }
      if (!fs.existsSync(path.join(projectPath, "examples", "sketches"))) {
        fs.mkdirSync(path.join(projectPath, "examples", "sketches"));
      }
      if (!fs.existsSync(path.join(projectPath, "examples", "features"))) {
        fs.mkdirSync(path.join(projectPath, "examples", "features"));
      }

      await fs.copy(
        path.join(templatePath, "examples"),
        path.join(projectPath, "examples")
      );
      await fs.copy(
        path.join(templatePath, "examples", "sketches"),
        path.join(projectPath, "examples", "sketches")
      );
      await fs.copy(
        path.join(templatePath, "examples", "features"),
        path.join(projectPath, "examples", "features")
      );
    }
  } catch (err) {
    console.error(err);
  }
  spinner.succeed("copied template files");

  // Merge geoprocessing metadata

  // TODO: Should not duplicate existing entries
  spinner.start("adding geoprocessing metadata");
  const tplGeoprocessing = JSON.parse(
    fs.readFileSync(path.join(templatePath, "geoprocessing.json")).toString()
  );
  const dstGeoprocessing = JSON.parse(
    fs.readFileSync(path.join(projectPath, "geoprocessing.json")).toString()
  );

  const geoprocessingJSON = {
    ...dstGeoprocessing,
    clients: [
      ...(dstGeoprocessing?.clients || []),
      ...(tplGeoprocessing?.clients || []),
    ],
    functions: [
      ...(dstGeoprocessing?.functions || []),
      ...(tplGeoprocessing?.functions || []),
    ],
  };

  fs.writeFileSync(
    path.join(projectPath, "geoprocessing.json"),
    JSON.stringify(geoprocessingJSON, null, "  ")
  );
  spinner.succeed("added template metadata");

  // Install new dependencies

  if (interactive && !skipInstall) {
    spinner.start("installing new dependencies with npm");
    const { stderr, stdout, error } = await exec("npm install", {
      cwd: projectPath,
    });
    if (error) {
      console.log(error);
      process.exit();
    }
    spinner.succeed("installed new dependencies");
  }
}

export { addTemplate };

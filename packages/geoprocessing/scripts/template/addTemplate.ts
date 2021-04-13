import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { Package } from "../init/init";
import util from "util";
const exec = util.promisify(require("child_process").exec);

interface TemplateOptions {
  name: string;
}

export interface ChooseTemplateOption {
  templates: string[];
}

export const templateQuestion = {
  type: "checkbox",
  name: "templates",
  message: "What templates would you like to install?",
  choices: [
    {
      value: "gp-clip",
      name: "Global clipping preprocessor",
    },
  ],
};

async function addTemplate(projectPath?: string) {
  // TODO: generate list by reading list of packages with keyword 'template'
  const answers = await inquirer.prompt<ChooseTemplateOption>([
    templateQuestion,
  ]);

  if (answers.templates) {
    try {
      await copyTemplates(answers.templates);
    } catch (error) {
      console.error(error);
      process.exit();
    }
  }
}

if (require.main === module) {
  addTemplate();
}

export async function copyTemplates(
  names: string[],
  options?: {
    interactive?: boolean;
    /** path to the user project */
    projectPath?: string;
    /** skip if being called by another command that will run install later */
    skipInstall?: boolean;
  }
) {
  const { interactive, projectPath, skipInstall } = {
    ...{ interactive: true, projectPath: ".", skipInstall: false },
    ...options,
  };
  const spinner = interactive
    ? ora(`Adding templates`).start()
    : {
        start: () => false,
        stop: () => false,
        succeed: () => false,
        fail: () => false,
      };

  const templatesPath = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    "gp-templates"
  );

  // console.log("options: ", options);
  // console.log("dirname", __dirname);
  // console.log("you are here:", process.cwd());
  // console.log("project path:", projectPath);
  // console.log("template path:", templatesPath);

  if (!fs.existsSync(path.join(projectPath, "package.json"))) {
    spinner.fail(
      "Could not find your project, are you in your project root directory?"
    );
    process.exit();
  }

  for (const templateName of names) {
    // Find template
    const templatePath = path.join(templatesPath, templateName);

    if (!fs.existsSync(templatePath)) {
      spinner.fail(`Could not find template ${templateName} ${templatePath}`);
      process.exit();
    }

    // Copy package metadata
    spinner.start(`adding template ${templateName}`);
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

    // Copy file assets, but only if there is something to copy. Creates directories first as needed
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
      spinner.fail("Error");
      console.error(err);
      process.exit();
    }

    // Merge geoprocessing metadata
    // TODO: Should not duplicate existing entries
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

    await fs.copy(
      path.join(templatePath, "data"),
      path.join(projectPath, "data")
    );

    spinner.succeed(`added template ${templateName}`);
  }

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

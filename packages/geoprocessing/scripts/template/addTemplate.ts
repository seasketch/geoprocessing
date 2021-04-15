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

function getTemplatesPath() {
  return path.join(__dirname, "..", "..", "templates", "gp-templates");
}

export async function getTemplateQuestion() {
  const templatesPath = getTemplatesPath();
  // Extract list of template names and descriptions from bundles
  const templateNames = await fs.readdir(templatesPath);

  if (templateNames.length === 0) {
    console.error("No templates found, exiting");
    console.log("__dirname", __dirname);
    console.log("cwd", process.cwd());
    console.log("template path:", templatesPath);
    process.exit();
  }

  const templateDescriptions = templateNames.map((name) => {
    try {
      const templatePackageMetaPath = path.join(
        templatesPath,
        name,
        "package.json"
      );
      return JSON.parse(fs.readFileSync(templatePackageMetaPath).toString())
        .description;
    } catch (error) {
      console.error(
        `Missing package.json or its description for template ${name}`
      );
      console.error(error);
      process.exit();
    }
  });

  const templateQuestion = {
    type: "checkbox",
    name: "templates",
    message:
      "What templates would you like to install? (you can always add them later)",
    choices: [],
  };

  return {
    ...templateQuestion,
    choices: [
      ...templateQuestion.choices,
      ...templateNames.map((name, index) => ({
        value: name,
        name: `${name} - ${templateDescriptions[index]}`,
      })),
    ],
  };
}

async function addTemplate(projectPath?: string) {
  const templateQuestion = await getTemplateQuestion();
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

  if (!fs.existsSync(path.join(projectPath, "package.json"))) {
    spinner.fail(
      "Could not find your project, are you in your project root directory?"
    );
    process.exit();
  }

  const templatesPath = getTemplatesPath();
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
    // Note that fs.copy will copy everything inside of the src directory, not the entire directory itself
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

      // Copy examples without test outputs, let the user generate them
      if (fs.existsSync(path.join(templatePath, "examples"))) {
        if (!fs.existsSync(path.join(projectPath, "examples"))) {
          fs.mkdirSync(path.join(projectPath, "examples"));
        }

        if (fs.existsSync(path.join(templatePath, "examples", "sketches"))) {
          if (!fs.existsSync(path.join(projectPath, "examples", "sketches"))) {
            fs.mkdirSync(path.join(projectPath, "examples", "sketches"));
          }
          await fs.copy(
            path.join(templatePath, "examples", "sketches"),
            path.join(projectPath, "examples", "sketches")
          );
        }

        if (fs.existsSync(path.join(templatePath, "examples", "features"))) {
          if (!fs.existsSync(path.join(projectPath, "examples", "features"))) {
            fs.mkdirSync(path.join(projectPath, "examples", "features"));
          }
          await fs.copy(
            path.join(templatePath, "examples", "features"),
            path.join(projectPath, "examples", "features")
          );
        }
      }

      if (fs.existsSync(path.join(templatePath, "data"))) {
        if (!fs.existsSync(path.join(projectPath, "data"))) {
          fs.mkdirSync(path.join(projectPath, "data"));
        }
        await fs.copy(
          path.join(templatePath, "data"),
          path.join(projectPath, "data")
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

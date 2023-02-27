import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import util from "util";
import { GeoprocessingJsonConfig, Package } from "../../src/types";
const exec = util.promisify(require("child_process").exec);

export interface TemplateMetadata {
  templates: string | string[];
}

const TemplateTypes = ["add-on-template", "starter-template"] as const;
export type TemplateType = typeof TemplateTypes[number];

function getTemplatesPath(templateType: TemplateType): string {
  // published bundle path exists if this is being run from the published geoprocessing package
  // (e.g. via geoprocessing init or add:template)
  const publishedBundlePath = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    `${templateType}s`
  );
  if (fs.existsSync(publishedBundlePath)) {
    // Use bundled templates if user running published version, e.g. via geoprocessing init
    return publishedBundlePath;
  } else {
    // Use src templates
    return path.join(__dirname, "..", "..", "..");
  }
}

export async function getTemplateQuestion(templateType: TemplateType) {
  const templatesPath = getTemplatesPath(templateType);
  // Extract list of template names and descriptions from bundles
  const templateNames = await fs.readdir(templatesPath);

  if (templateNames.length === 0) {
    console.error(`No add-on templates currently available`);
    console.log("template path:", templatesPath);
    console.log("add:template running from:", __dirname);
    console.log("CLI running from:", process.cwd());
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

  // Allow selection of one starter template or multiple add-on templates
  const templateQuestion = {
    type: templateType === "add-on-template" ? "checkbox" : "list",
    name: "templates",
    message: `What ${templateType}${
      templateType === "add-on-template" ? "s" : ""
    } would you like to install?`,
    choices: templateNames.map((name, index) => ({
      value: name,
      name: `${name} - ${templateDescriptions[index]}`,
    })),
  };

  return templateQuestion;
}

/**
 * Asks template questions and invokes copy of templates to projectPath.  Invoked via CLI so assume 'add-on-template' type
 */
async function addTemplate(projectPath?: string) {
  // Assume invoked via CLI so we are installing add-on-templates
  const templateType = "add-on-template";
  const templateQuestion = await getTemplateQuestion(templateType);
  const answers = await inquirer.prompt<TemplateMetadata>([templateQuestion]);

  if (answers.templates) {
    try {
      const templateList = Array.isArray(answers.templates)
        ? answers.templates
        : [answers.templates];
      if (answers.templates.length > 0) {
        await copyTemplates(templateType, templateList);
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
      process.exit();
    }
  }
}

if (require.main === module) {
  addTemplate();
}

/** Copies templates by name to gp project */
export async function copyTemplates(
  templateType: TemplateType,
  templateNames: string[],
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

  if (!templateNames || templateNames.length === 0) {
    spinner.succeed("No templates selected, skipping");
    return;
  }

  if (!fs.existsSync(path.join(projectPath, "package.json"))) {
    spinner.fail(
      "Could not find your project, are you in your project root directory?"
    );
    process.exit();
  }

  const templatesPath = getTemplatesPath(templateType);
  for (const templateName of templateNames) {
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
    // Remove the templates seasketch dependency, the version will not match if running from canary gp release, and don't want it to overwrite
    if (templatePackage.devDependencies)
      delete templatePackage.devDependencies["@seasketch/geoprocessing"];
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
        }

        if (fs.existsSync(path.join(templatePath, "examples", "features"))) {
          if (!fs.existsSync(path.join(projectPath, "examples", "features"))) {
            fs.mkdirSync(path.join(projectPath, "examples", "features"));
          }
        }
      }

      // Merge .gitignore, starting with line 4
      if (fs.existsSync(path.join(templatePath, "_gitignore"))) {
        // Convert to array of lines
        const tplIgnoreArray = fs
          .readFileSync(path.join(templatePath, "_gitignore"))
          .toString()
          .split("\n");
        if (tplIgnoreArray.length > 3) {
          // Merge back into string with newlines and append to end of project file
          const tplIgnoreLines = tplIgnoreArray
            .slice(3)
            .reduce<string>((acc, line) => {
              return line.length > 0 ? acc.concat(line + "\n") : "";
            }, "\n");
          fs.appendFile(path.join(projectPath, ".gitignore"), tplIgnoreLines);
        }
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

    const geoprocessingJSON: GeoprocessingJsonConfig = {
      ...dstGeoprocessing,
      clients: [
        ...(dstGeoprocessing?.clients || []),
        ...(tplGeoprocessing?.clients || []),
      ],
      preprocessingFunctions: [
        ...(dstGeoprocessing?.preprocessingFunctions || []),
        ...(tplGeoprocessing?.preprocessingFunctions || []),
      ],
      geoprocessingFunctions: [
        ...(dstGeoprocessing?.geoprocessingFunctions || []),
        ...(tplGeoprocessing?.geoprocessingFunctions || []),
      ],
    };

    fs.writeFileSync(
      path.join(projectPath, "geoprocessing.json"),
      JSON.stringify(geoprocessingJSON, null, "  ")
    );

    spinner.succeed(`added ${templateName}`);
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

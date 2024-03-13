import fs from "fs-extra";
import { $ } from "zx";
import { TemplateType } from "../template/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

$.verbose = true;

const packagesPath = path.join(__dirname, "..", "..", "..");
const distPath = path.join(__dirname, "..", "..", "dist");

// console.log("you are here:", process.cwd());
// console.log("src template path:", templatesPath);
// console.log("dist path:", distPath);
// console.log("distTemplatesPath", distTemplatesPath);

/**
 * Copy assets to dist for project use. e.g. project start-storybook looks for img assets in dist
 */
async function bundleAssets() {
  const assetsPath = path.join(__dirname, "..", "..", "src", "assets");
  const distAssetsPath = path.join(distPath, "src", "assets");

  // Delete old assets if they exist
  if (fs.existsSync(path.join(distAssetsPath))) {
    fs.rmdirSync(distAssetsPath, { recursive: true });
  }

  if (!fs.existsSync(path.join(distAssetsPath))) {
    fs.mkdirSync(path.join(distAssetsPath));
  }

  if (fs.existsSync(assetsPath)) {
    await fs.copySync(assetsPath, distAssetsPath);
  }
}

/**
 * Copy base project from its standalone package to dist
 * Base project can then be installed via gp commands.
 */
async function bundleBaseProject() {
  const distBaseProjectPath = `${distPath}/base-project`;
  const baseProjectPath = `${__dirname}/../../../base-project`;

  const distI18nPath = `${distPath}/base-project/src/i18n`;
  const srcI18nPath = `${__dirname}/../../src/i18n`;

  // Delete old template bundles if they exist
  if (fs.existsSync(path.join(distBaseProjectPath))) {
    fs.rmdirSync(distBaseProjectPath, { recursive: true });
  }

  try {
    await fs.ensureDir(distBaseProjectPath);
    await $`cp -R -P ${baseProjectPath}/* ${distBaseProjectPath}`;
    await $`cp -R -P ${baseProjectPath}/. ${distBaseProjectPath}`;
    await $`mv ${distBaseProjectPath}/.gitignore ${distBaseProjectPath}/_gitignore`;
    await $`rm -rf ${distBaseProjectPath}/node_modules`;
    await $`cp -R -P ${srcI18nPath}/. ${distI18nPath}`;
    await $`mkdir ${distI18nPath}/baseLang`;
    await $`mv ${distI18nPath}/lang/* ${distI18nPath}/baseLang`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Base project copy failed");
      throw err;
    }
  }
}

/**
 * Copy template type from their standalone package to dist
 */
async function bundleTemplates(templateType: TemplateType) {
  const distDirName = `${templateType}s`;
  const distTemplatesPath = path.join(distPath, "templates", distDirName);

  // Delete old template bundles if they exist
  if (fs.existsSync(path.join(distTemplatesPath))) {
    fs.rmdirSync(distTemplatesPath, { recursive: true });
  }
  // Stub out template dir
  fs.ensureDir(distTemplatesPath);

  if (!fs.existsSync(path.join(distPath, "templates"))) {
    fs.mkdirSync(path.join(distPath, "templates"));
  }

  // Find packages with keyword 'template'
  const templateNames = (await fs.readdir(packagesPath))
    .filter((name) => fs.statSync(path.join(packagesPath, name)).isDirectory())
    .filter((dirName) => {
      try {
        const templatePackageMetaPath = path.join(
          packagesPath,
          dirName,
          "package.json"
        );
        return JSON.parse(
          fs.readFileSync(templatePackageMetaPath).toString()
        )?.keywords?.includes(templateType);
      } catch (error) {
        console.error(
          `Missing package.json or its description for template ${dirName}`
        );
        console.error(error);
        process.exit();
      }
    });

  for (const templateName of templateNames) {
    const templatePath = path.join(packagesPath, templateName);
    const distTemplatePath = path.join(distTemplatesPath, templateName);

    if (fs.existsSync(templatePath)) {
      console.log(`bundling template ${templateName}`);
    } else {
      console.error(
        `Could not find template ${templateName} in ${templatePath}`
      );
      process.exit();
    }

    await fs.copy(
      path.join(templatePath, "package.json"),
      path.join(distTemplatePath, "package.json")
    );

    await fs.copy(
      path.join(templatePath, "geoprocessing.json"),
      path.join(distTemplatePath, "geoprocessing.json")
    );

    if (!fs.existsSync(path.join(distTemplatePath, "src"))) {
      fs.mkdirSync(path.join(distTemplatePath, "src"));
    }

    if (fs.existsSync(path.join(templatePath, "src", "functions"))) {
      if (!fs.existsSync(path.join(distTemplatePath, "src", "functions"))) {
        fs.mkdirSync(path.join(distTemplatePath, "src", "functions"));
      }
      await fs.copy(
        path.join(templatePath, "src", "functions"),
        path.join(distTemplatePath, "src", "functions")
      );
    }

    if (fs.existsSync(path.join(templatePath, "src", "components"))) {
      if (!fs.existsSync(path.join(distTemplatePath, "src", "components"))) {
        fs.mkdirSync(path.join(distTemplatePath, "src", "components"));
      }
      await fs.copy(
        path.join(templatePath, "src", "components"),
        path.join(distTemplatePath, "src", "components")
      );
    }

    if (fs.existsSync(path.join(templatePath, "src", "assets"))) {
      if (!fs.existsSync(path.join(distTemplatePath, "src", "assets"))) {
        fs.mkdirSync(path.join(distTemplatePath, "src", "assets"));
      }
      await fs.copy(
        path.join(templatePath, "src", "assets"),
        path.join(distTemplatePath, "src", "assets")
      );
    }

    if (fs.existsSync(path.join(templatePath, "src", "clients"))) {
      if (!fs.existsSync(path.join(distTemplatePath, "src", "clients"))) {
        fs.mkdirSync(path.join(distTemplatePath, "src", "clients"));
      }
      await fs.copy(
        path.join(templatePath, "src", "clients"),
        path.join(distTemplatePath, "src", "clients")
      );
    }

    if (fs.existsSync(path.join(templatePath, "examples"))) {
      if (!fs.existsSync(path.join(distTemplatePath, "examples"))) {
        fs.mkdirSync(path.join(distTemplatePath, "examples"));
      }

      if (fs.existsSync(path.join(templatePath, "examples", "features"))) {
        if (
          !fs.existsSync(path.join(distTemplatePath, "examples", "features"))
        ) {
          fs.mkdirSync(path.join(distTemplatePath, "examples", "features"));
        }
      }

      if (fs.existsSync(path.join(templatePath, "examples", "sketches"))) {
        if (
          !fs.existsSync(path.join(distTemplatePath, "examples", "sketches"))
        ) {
          fs.mkdirSync(path.join(distTemplatePath, "examples", "sketches"));
        }
      }

      // data, copy everything except .env, docker-compose.yml
      if (fs.existsSync(path.join(templatePath, "data"))) {
        await fs.copy(
          path.join(templatePath, "data"),
          path.join(distTemplatePath, "data"),
          {
            filter: (srcPath) => {
              if (path.basename(srcPath) == ".env") return false;
              if (path.basename(srcPath) == "docker-compose.yml") return false;
              return true;
            },
          }
        );
      }

      // Rename file so npm pack doesn't exclude it.
      if (fs.existsSync(path.join(templatePath, ".gitignore"))) {
        await fs.copy(
          path.join(templatePath, ".gitignore"),
          path.join(distTemplatePath, "_gitignore")
        );
      }
    }
  }
}

bundleAssets().then(() => {
  console.log("finished bundling assets");
});

bundleTemplates("starter-template").then(() => {
  console.log("finished bundling starter templates");
});
bundleTemplates("add-on-template").then(() => {
  console.log("finished bundling add-on templates");
});

bundleBaseProject().then(() => {
  console.log("finished bundling base project");
});

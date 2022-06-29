const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const packagesPath = path.join(__dirname, "..", "..", "..");
const distPath = path.join(__dirname, "..", "..", "dist");
const distTemplatesPath = path.join(distPath, "templates", "gp-templates");

// console.log("you are here:", process.cwd());
// console.log("src template path:", templatesPath);
// console.log("dist path:", distPath);
// console.log("distTemplatesPath", distTemplatesPath);

/**
 * Copy assets for project use. e.g. project start-storybook looks for img assets in dist
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
    // if (!fs.existsSync(distAssetsPath)) {
    //   fs.mkdirSync(distAssetsPath, "src", "functions"));
    // }
    await fs.copySync(assetsPath, distAssetsPath);
  }
}

/**
 * Copy templates from their standalone package into geoprocessing distribution
 * Templates are then installed via gp commands.  This could be improved to publish template bundles
 * outside of the gp library
 */
async function bundleTemplates() {
  // Delete old template bundles if they exist
  if (fs.existsSync(path.join(distTemplatesPath))) {
    fs.rmdirSync(distTemplatesPath, { recursive: true });
  }

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
        )?.keywords?.includes("template");
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
        await fs.copy(
          path.join(templatePath, "examples", "features"),
          path.join(distTemplatePath, "examples", "features")
        );
      }

      if (fs.existsSync(path.join(templatePath, "examples", "sketches"))) {
        if (
          !fs.existsSync(path.join(distTemplatePath, "examples", "sketches"))
        ) {
          fs.mkdirSync(path.join(distTemplatePath, "examples", "sketches"));
        }
        await fs.copy(
          path.join(templatePath, "examples", "sketches"),
          path.join(distTemplatePath, "examples", "sketches")
        );
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

bundleTemplates().then(() => {
  console.log("finished bundling templates");
});
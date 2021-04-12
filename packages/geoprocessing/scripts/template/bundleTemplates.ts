// Script to copy templates from their standalone package into geoprocessing distribution
// Templates are then installed via gp commands.  This could be improved to publish template bundles
// outside of the gp library
const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const templatesPath = path.join(__dirname, "..", "..", "..");
const distPath = path.join(__dirname, "..", "..", "dist");
const distTemplatesPath = path.join(distPath, "templates", "gp-templates");

// console.log("you are here:", process.cwd());
// console.log("src template path:", templatesPath);
// console.log("dist path:", distPath);
// console.log("distTemplatesPath", distTemplatesPath);

async function bundleTemplates() {
  if (!fs.existsSync(path.join(distPath, "templates"))) {
    fs.mkdirSync(path.join(distPath, "templates"));
  }

  const names = ["gp-clip"];
  for (const templateName of names) {
    const templatePath = path.join(templatesPath, templateName);
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
      if (!fs.existsSync(path.join(distTemplatePath, "examples", "sketches"))) {
        fs.mkdirSync(path.join(distTemplatePath, "examples", "sketches"));
      }
      if (!fs.existsSync(path.join(distTemplatePath, "examples", "features"))) {
        fs.mkdirSync(path.join(distTemplatePath, "examples", "features"));
      }

      await fs.copy(
        path.join(templatePath, "examples", "sketches"),
        path.join(distTemplatePath, "examples", "sketches")
      );
      await fs.copy(
        path.join(templatePath, "examples", "features"),
        path.join(distTemplatePath, "examples", "features")
      );

      // data, copy everything except .env, docker-compose.yml
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
  }
}

bundleTemplates().then(() => {
  console.log("finished bundling templates");
});

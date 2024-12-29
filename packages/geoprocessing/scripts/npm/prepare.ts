import fs from "fs-extra";
import { $ } from "zx";
import path from "node:path";

$.verbose = true;

const packagesPath = path.join(import.meta.dirname, "..", "..", "..");
const distPath = path.join(import.meta.dirname, "..", "..", "dist");

// console.log("you are here:", process.cwd());
// console.log("src template path:", templatesPath);
// console.log("dist path:", distPath);
// console.log("distTemplatesPath", distTemplatesPath);

/**
 * Copy assets to dist for project use. e.g. project storybook looks for img assets in dist
 */
async function bundleAssets() {
  const assetsPath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "src",
    "assets",
  );
  const distAssetsPath = path.join(distPath, "src", "assets");

  // Delete old assets if they exist
  if (fs.existsSync(path.join(distAssetsPath))) {
    fs.rmSync(distAssetsPath, { recursive: true });
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
  const baseProjectPath = `${import.meta.dirname}/../../../base-project`;

  const distI18nPath = `${distPath}/base-project/src/i18n`;
  const srcI18nPath = `${import.meta.dirname}/../../src/i18n`;

  // Delete old template bundles if they exist
  if (fs.existsSync(path.join(distBaseProjectPath))) {
    fs.rmSync(distBaseProjectPath, { recursive: true });
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Base project copy failed");
      throw error;
    }
  }
}

/**
 * Copy report assets standalone package to dist
 */
async function bundleReportAssets() {
  const assetDirName = "report-assets";
  const srcAssetsPath = path.join(packagesPath, assetDirName);
  const distAssetsPath = path.join(distPath, assetDirName);

  // Delete old report-assets if they exist
  if (fs.existsSync(path.join(distAssetsPath))) {
    fs.rmSync(distAssetsPath, { recursive: true });
  }
  // Stub out assets dir
  fs.ensureDir(distAssetsPath);

  if (fs.existsSync(srcAssetsPath)) {
    console.log(`bundling template ${assetDirName}`);
  } else {
    console.error(
      `Could not find template ${assetDirName} in ${srcAssetsPath}`,
    );
    process.exit();
  }

  await fs.copy(
    path.join(srcAssetsPath, "package.json"),
    path.join(distAssetsPath, "package.json"),
  );

  await fs.copy(
    path.join(srcAssetsPath, "project", "geoprocessing.json"),
    path.join(distAssetsPath, "project", "geoprocessing.json"),
  );

  if (!fs.existsSync(path.join(distAssetsPath, "src"))) {
    fs.mkdirSync(path.join(distAssetsPath, "src"));
  }

  if (fs.existsSync(path.join(srcAssetsPath, "src", "functions"))) {
    if (!fs.existsSync(path.join(distAssetsPath, "src", "functions"))) {
      fs.mkdirSync(path.join(distAssetsPath, "src", "functions"));
    }
    await fs.copy(
      path.join(srcAssetsPath, "src", "functions"),
      path.join(distAssetsPath, "src", "functions"),
    );
  }

  if (fs.existsSync(path.join(srcAssetsPath, "src", "clients"))) {
    if (!fs.existsSync(path.join(distAssetsPath, "src", "clients"))) {
      fs.mkdirSync(path.join(distAssetsPath, "src", "clients"));
    }
    await fs.copy(
      path.join(srcAssetsPath, "src", "clients"),
      path.join(distAssetsPath, "src", "clients"),
    );
    if (fs.existsSync(`${distAssetsPath}/src/clients/.story-cache`)) {
      await fs.rm(`${distAssetsPath}/src/clients/.story-cache`, {
        recursive: true,
      });
    }
  }

  if (fs.existsSync(path.join(srcAssetsPath, "src", "components"))) {
    if (!fs.existsSync(path.join(distAssetsPath, "src", "components"))) {
      fs.mkdirSync(path.join(distAssetsPath, "src", "components"));
    }
    await fs.copy(
      path.join(srcAssetsPath, "src", "components"),
      path.join(distAssetsPath, "src", "components"),
    );
    if (fs.existsSync(`${distAssetsPath}/src/components/.story-cache`)) {
      await fs.rm(`${distAssetsPath}/src/components/.story-cache`, {
        recursive: true,
      });
    }
  }

  if (fs.existsSync(path.join(srcAssetsPath, "src", "assets"))) {
    if (!fs.existsSync(path.join(distAssetsPath, "src", "assets"))) {
      fs.mkdirSync(path.join(distAssetsPath, "src", "assets"));
    }
    await fs.copy(
      path.join(srcAssetsPath, "src", "assets"),
      path.join(distAssetsPath, "src", "assets"),
    );
  }

  if (fs.existsSync(path.join(srcAssetsPath, "examples"))) {
    if (!fs.existsSync(path.join(distAssetsPath, "examples"))) {
      fs.mkdirSync(path.join(distAssetsPath, "examples"));
    }

    if (
      fs.existsSync(path.join(srcAssetsPath, "examples", "features")) &&
      !fs.existsSync(path.join(distAssetsPath, "examples", "features"))
    ) {
      fs.mkdirSync(path.join(distAssetsPath, "examples", "features"));
    }

    if (
      fs.existsSync(path.join(srcAssetsPath, "examples", "sketches")) &&
      !fs.existsSync(path.join(distAssetsPath, "examples", "sketches"))
    ) {
      fs.mkdirSync(path.join(distAssetsPath, "examples", "sketches"));
    }

    // data, copy everything except .env, docker-compose.yml
    if (fs.existsSync(path.join(srcAssetsPath, "data"))) {
      await fs.copy(
        path.join(srcAssetsPath, "data"),
        path.join(distAssetsPath, "data"),
        {
          filter: (srcPath) => {
            if (path.basename(srcPath) == ".env") return false;
            if (path.basename(srcPath) == "docker-compose.yml") return false;
            return true;
          },
        },
      );
    }

    // Rename file so npm pack doesn't exclude it.
    if (fs.existsSync(path.join(srcAssetsPath, ".gitignore"))) {
      await fs.copy(
        path.join(srcAssetsPath, ".gitignore"),
        path.join(distAssetsPath, "_gitignore"),
      );
    }
  }
}

await bundleAssets();
console.log("finished bundling static assets");

await bundleReportAssets();
console.log("finished bundling report assets");

await bundleBaseProject();
console.log("finished bundling base project");

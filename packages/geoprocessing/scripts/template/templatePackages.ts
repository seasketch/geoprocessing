import { loadedPackageSchema } from "../../src/types/index.js";
import fs from "fs-extra";
import path from "path";
import { TemplateType } from "../types.js";

export async function getTemplatePackages(
  templateType: TemplateType,
  templatesPath,
) {
  // console.log("templatesPath", templatesPath);

  if (!fs.existsSync(templatesPath)) {
    throw new Error(
      "Templates path does not exist: " +
        templatesPath +
        " (getTemplatePackages)",
    );
  }

  const templateNames = await fs.readdir(templatesPath);
  // console.log("templateNames", templateNames);

  if (templateNames.length === 0) return [];

  const templatePackages = templateNames.map((name) => {
    try {
      const templatePackageMetaPath = path.join(
        templatesPath,
        name,
        "package.json",
      );
      // console.log("templatePackageMetaPath", templatePackageMetaPath);
      const rawPkg = fs.readJSONSync(templatePackageMetaPath);
      return loadedPackageSchema.parse(rawPkg);
    } catch (error) {
      console.error(`Missing package.json for template ${name}`);
      console.error(error);
      process.exit();
    }
  });

  return templatePackages;
}

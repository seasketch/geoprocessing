import { loadedPackageSchema } from "../../src/types/index.js";
import fs from "fs-extra";
import path from "path";
import { TemplateType } from "../types.js";

export async function getTemplatePackages(
  templateType: TemplateType,
  templatesPath
) {
  const templateNames = await fs.readdir(templatesPath);

  if (templateNames.length === 0) return [];

  const templatePackages = templateNames.map((name) => {
    try {
      const templatePackageMetaPath = path.join(
        templatesPath,
        name,
        "package.json"
      );
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

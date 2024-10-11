import { hasOwnProperty } from "../../client-core.js";
import { LoadedPackage } from "../../src/types/package.js";
import cloneDeep from "lodash/cloneDeep.js";

// function that sorts object keys and returns a new sorted object
function sortObjectKeys(obj: Record<string, any>) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

/**
 * Returns a new package.json with updated scripts, dependencies, and devDependencies.  Does not remove any dependencies or devDependencies, that is up to the report developer.
 * @param srcPkg package starting point (deep cloned)
 * @param basePkg package to add/update srcPkg from, overwrites version string not checking for greater version number or fuzzy matching
 * @param otherPkgs packages to update from if present in srcPkg after basePkg merge
 * @returns
 */
export function updatePackageJson(
  srcPkg: LoadedPackage,
  basePkg: LoadedPackage,
  otherPkgs: LoadedPackage[] = [],
) {
  const projectPkg = cloneDeep(srcPkg);

  // add/update projectPkg with basePkg
  for (const key of Object.keys(basePkg.scripts)) {
    projectPkg.scripts[key] = basePkg.scripts[key];
  }

  for (const key of Object.keys(basePkg.dependencies)) {
    if (key !== "@seasketch/geoprocessing") {
      projectPkg.dependencies[key] = basePkg.dependencies[key];
    }
  }

  if (basePkg.devDependencies && projectPkg.devDependencies) {
    for (const key of Object.keys(basePkg.devDependencies)) {
      if (
        basePkg.devDependencies &&
        projectPkg.devDependencies &&
        key !== "@seasketch/geoprocessing"
      ) {
        projectPkg.devDependencies[key] = basePkg.devDependencies[key];
      }
    }
  }

  // add otherPkgs to projectPkg if present, skip scripts
  for (const otherPkg of otherPkgs) {
    for (const key of Object.keys(otherPkg.dependencies)) {
      if (
        key !== "@seasketch/geoprocessing" &&
        hasOwnProperty(projectPkg.dependencies, key)
      ) {
        projectPkg.dependencies[key] = otherPkg.dependencies[key];
      }
    }

    if (otherPkg.devDependencies) {
      for (const key of Object.keys(otherPkg.devDependencies)) {
        if (
          projectPkg.devDependencies &&
          otherPkg.devDependencies &&
          key !== "@seasketch/geoprocessing" &&
          hasOwnProperty(projectPkg.devDependencies, key)
        ) {
          projectPkg.devDependencies[key] = otherPkg.devDependencies[key];
        }
      }
    }
  }

  // Remove any devDependencies that are also in dependencies
  if (projectPkg.devDependencies) {
    for (const key of Object.keys(projectPkg.dependencies)) {
      if (hasOwnProperty(projectPkg.devDependencies, key)) {
        delete projectPkg.devDependencies[key];
      }
    }
  }

  projectPkg.scripts = sortObjectKeys(projectPkg.scripts);
  projectPkg.dependencies = sortObjectKeys(projectPkg.dependencies);
  if (projectPkg.devDependencies)
    projectPkg.devDependencies = sortObjectKeys(projectPkg.devDependencies);

  // Allow new properties in basePkg to be merged in
  const baseKeys = Object.keys(basePkg);
  // Define keys to not update
  const keysNotToUpdate: Set<string> = new Set([
    "author",
    "bugs",
    "dependencies",
    "description",
    "devDependencies",
    "homepage",
    "keywords",
    "license",
    "name",
    "private",
    "repositoryUrl",
    "scripts",
    "type",
    "version",
  ]);
  for (const baseKey of baseKeys) {
    if (!keysNotToUpdate.has(baseKey)) {
      projectPkg[baseKey] = basePkg[baseKey];
    }
  }

  return projectPkg;
}

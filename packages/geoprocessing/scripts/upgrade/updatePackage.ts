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
  Object.keys(basePkg.scripts).forEach((key) => {
    projectPkg.scripts[key] = basePkg.scripts[key];
  });

  Object.keys(basePkg.dependencies).forEach((key) => {
    if (key !== "@seasketch/geoprocessing") {
      projectPkg.dependencies[key] = basePkg.dependencies[key];
    }
  });

  if (basePkg.devDependencies && projectPkg.devDependencies) {
    Object.keys(basePkg.devDependencies).forEach((key) => {
      if (basePkg.devDependencies && projectPkg.devDependencies) {
        if (key !== "@seasketch/geoprocessing") {
          projectPkg.devDependencies[key] = basePkg.devDependencies[key];
        }
      }
    });
  }

  // add otherPkgs to projectPkg if present, skip scripts
  otherPkgs.forEach((otherPkg) => {
    Object.keys(otherPkg.dependencies).forEach((key) => {
      if (
        key !== "@seasketch/geoprocessing" &&
        hasOwnProperty(projectPkg.dependencies, key)
      ) {
        projectPkg.dependencies[key] = otherPkg.dependencies[key];
      }
    });

    if (otherPkg.devDependencies) {
      Object.keys(otherPkg.devDependencies).forEach((key) => {
        if (projectPkg.devDependencies && otherPkg.devDependencies) {
          if (
            key !== "@seasketch/geoprocessing" &&
            hasOwnProperty(projectPkg.devDependencies, key)
          ) {
            projectPkg.devDependencies[key] = otherPkg.devDependencies[key];
          }
        }
      });
    }
  });

  projectPkg.scripts = sortObjectKeys(projectPkg.scripts);
  projectPkg.dependencies = sortObjectKeys(projectPkg.dependencies);
  if (projectPkg.devDependencies)
    projectPkg.devDependencies = sortObjectKeys(projectPkg.devDependencies);

  return projectPkg;
}

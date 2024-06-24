import { hasOwnProperty } from "../../client-core.js";
import { loadedPackageSchema, LoadedPackage } from "../../src/types/package.js";
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
  otherPkgs: LoadedPackage[] = []
) {
  const projectPkg = cloneDeep(srcPkg);

  // add/update projectPkg with basePkg
  Object.keys(basePkg.scripts).forEach((key) => {
    projectPkg.scripts[key] = basePkg.scripts[key];
  });

  Object.keys(basePkg.dependencies).forEach((key) => {
    projectPkg.dependencies[key] = basePkg.dependencies[key];
  });

  Object.keys(basePkg.devDependencies).forEach((key) => {
    projectPkg.devDependencies[key] = basePkg.devDependencies[key];
  });

  // add otherPkgs to projectPkg if present
  otherPkgs.forEach((otherPkg) => {
    Object.keys(otherPkg.scripts).forEach((key) => {
      if (hasOwnProperty(projectPkg.scripts, key)) {
        projectPkg.scripts[key] = otherPkg.scripts[key];
      }
    });

    Object.keys(otherPkg.dependencies).forEach((key) => {
      if (hasOwnProperty(projectPkg.dependencies, key)) {
        projectPkg.dependencies[key] = otherPkg.dependencies[key];
      }
    });

    Object.keys(otherPkg.devDependencies).forEach((key) => {
      if (hasOwnProperty(projectPkg.devDependencies, key)) {
        projectPkg.devDependencies[key] = otherPkg.devDependencies[key];
      }
    });
  });

  projectPkg.scripts = sortObjectKeys(projectPkg.scripts);
  projectPkg.dependencies = sortObjectKeys(projectPkg.dependencies);
  projectPkg.devDependencies = sortObjectKeys(projectPkg.devDependencies);

  // Don't overwrite geoprocessing version, should already be correct
  if (projectPkg.dependencies["geoprocessing"]) {
    projectPkg.dependencies["geoprocessing"] =
      srcPkg.dependencies["geoprocessing"];
  }

  if (projectPkg.devDependencies["geoprocessing"]) {
    projectPkg.devDependencies["geoprocessing"] =
      srcPkg.devDependencies["geoprocessing"];
  }

  return projectPkg;
}

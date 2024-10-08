import { updatePackageJson } from "./updatePackage.js";
import { LoadedPackage } from "../../src/types/package.js";
import { describe, test, expect } from "vitest";
import { hasOwnProperty } from "../../client-core.js";

const srcPkg: LoadedPackage = {
  name: "@seasketch/base-project",
  version: "7.0.0-beta.4",
  description: "initial user-installed project",
  private: true,
  type: "module",
  scripts: {
    "start:data": "http-server data/dist -c-1",
    "clear:results": "geoprocessing clear:results",
  },
  keywords: ["@seasketch/geoprocessing"],
  dependencies: {
    "@turf/area": "6.0.0",
    "@turf/bbox": "6.0.0",
  },
  devDependencies: {
    vite: "^5.2.10",
    vitest: "^0.5.0",
    "other-dev-dependency": "0.6.0",
  },
  repositoryUrl: "",
  author: "",
  license: "",
};

const basePkg: LoadedPackage = {
  name: "@seasketch/base-project",
  version: "7.0.0-beta.4",
  description: "initial user-installed project",
  private: true,
  type: "module",
  scripts: {
    "clear:results": "geoprocessing clear:results",
    upgrade: "geoprocessing upgrade",
  },
  keywords: ["@seasketch/geoprocessing"],
  dependencies: {
    "@turf/area": "7.0.0",
    "@turf/bbox": "7.0.0",
    "react-i18next": "^14.1.1",
  },
  devDependencies: {
    vite: "^5.2.11",
    vitest: "^1.6.0",
    zx: "^8.1.0",
  },
  repositoryUrl: "",
  author: "",
  license: "",
};

const otherPkg: LoadedPackage = {
  name: "@seasketch/other-package",
  version: "1.0.0",
  description: "other package",
  private: true,
  type: "module",
  scripts: {
    "other-script": "geoprocessing other-script",
  },
  keywords: ["@seasketch/geoprocessing"],
  dependencies: {
    "other-dependency": "1.0.0",
    "react-i18next": "^14.1.1",
  },
  devDependencies: {
    "other-dev-dependency": "1.0.0",
    zx: "^8.1.0",
  },
  repositoryUrl: "",
  author: "",
  license: "",
};

describe("updatePackage", () => {
  test("scripts are updated", async () => {
    const updatedPkg = updatePackageJson(srcPkg, basePkg);
    const keys = Object.keys(updatedPkg.scripts);
    expect(keys.length).toEqual(3);
    expect(keys.includes("start:data")).toBeTruthy();
    expect(keys.includes("clear:results")).toBeTruthy();
    expect(keys.includes("upgrade")).toBeTruthy();
  });

  test("dependencies are updated", async () => {
    const updatedPkg = updatePackageJson(srcPkg, basePkg);
    const keys = Object.keys(updatedPkg.dependencies);
    expect(keys.length).toEqual(3);
    expect(keys.includes("@turf/area")).toBeTruthy();
    expect(keys.includes("@turf/bbox")).toBeTruthy();
    expect(keys.includes("react-i18next")).toBeTruthy();
    expect(updatedPkg.dependencies["@turf/area"]).toEqual("7.0.0");
    expect(updatedPkg.dependencies["@turf/bbox"]).toEqual("7.0.0");
    expect(updatedPkg.dependencies["react-i18next"]).toEqual("^14.1.1");
  });

  test("devDependencies are updated", async () => {
    const updatedPkg = updatePackageJson(srcPkg, basePkg);
    if (updatedPkg.devDependencies) {
      const keys = Object.keys(updatedPkg.devDependencies);
      expect(keys.length).toEqual(4);
      expect(keys.includes("vite")).toBeTruthy();
      expect(keys.includes("vitest")).toBeTruthy();
      expect(keys.includes("zx")).toBeTruthy();
      expect(updatedPkg.devDependencies["vite"]).toEqual("^5.2.11");
      expect(updatedPkg.devDependencies["vitest"]).toEqual("^1.6.0");
      expect(updatedPkg.devDependencies["zx"]).toEqual("^8.1.0");
    }
  });

  test("otherPkgs are updated if present in srcPkg", async () => {
    const updatedPkg = updatePackageJson(srcPkg, basePkg, [otherPkg]);
    const scriptKeys = Object.keys(updatedPkg.scripts);
    const dependencyKeys = Object.keys(updatedPkg.dependencies);
    if (updatedPkg.devDependencies) {
      const devDependencyKeys = Object.keys(updatedPkg.devDependencies);
      expect(scriptKeys.length).toEqual(3);
      expect(scriptKeys.includes("other-script")).toBeFalsy();
      expect(dependencyKeys.length).toEqual(3);
      expect(dependencyKeys.includes("other-dependency")).toBeFalsy();
      expect(devDependencyKeys.length).toEqual(4);
      expect(devDependencyKeys.includes("other-dev-dependency")).toBeTruthy();
      expect(updatedPkg.devDependencies["other-dev-dependency"]).toEqual(
        "1.0.0",
      );
    }
  });

  test("extra properties are not lost", async () => {
    const extraPkg = { ...srcPkg, extra: "extra" } as LoadedPackage;
    const extraBasePkg = {
      ...basePkg,
      extraBase: "extraBase",
    } as LoadedPackage;
    const updatedPkg = updatePackageJson(extraPkg, extraBasePkg, [otherPkg]);
    console.log("updatedPkgz", updatedPkg);
    expect(hasOwnProperty(updatedPkg, "extra")).toBeTruthy();
    expect(hasOwnProperty(updatedPkg, "extraBase")).toBeTruthy();
  });
});

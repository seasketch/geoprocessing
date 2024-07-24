import { Package, GeoprocessingJsonConfig } from "../../src/types/index.js";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { Manifest } from "../manifest.js";
import { TestComponentTypes } from "./types.js";
import { setupProjectDirs } from "../testing/lifecycle.js";
import fs from "fs-extra";
import { buildProjectFunctions } from "../build/buildProjectFunctions.js";

/**
 * Creates test project build, with the components requested, at project path and returns the resulting manifest
 */
export default async function createTestBuild(
  projectName: string,
  projectPath: string,
  /** test components to add */
  components: TestComponentTypes[]
): Promise<Manifest> {
  await setupProjectDirs(projectPath);

  // Create source package
  const pkgGeo: Package = {
    name: projectName,
    version: "1.0.0",
    description: `Test project with components ${components.join(", ")}`,
    dependencies: {},
    type: "module",
    devDependencies: {},
    author: "Test",
    license: "UNLICENSED",
  };
  fs.writeJSONSync(`${projectPath}/package.json`, pkgGeo);

  // Create project assets
  let gpConfig: GeoprocessingJsonConfig = {
    author: "Test <test@test.com>",
    organization: "Test Org",
    region: "us-west-1",
    preprocessingFunctions: [],
    geoprocessingFunctions: [],
    clients: [],
  };
  let preprocessingBundles: PreprocessingBundle[] = [];
  let geoprocessingBundles: GeoprocessingBundle[] = [];

  interface TestResult {
    result: number;
  }

  if (components.includes("preprocessor")) {
    gpConfig = {
      ...gpConfig,
      preprocessingFunctions: ["src/functions/testPreprocessor.ts"],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testPreprocessor.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/helpers";
    import { PreprocessingHandler } from "../../../../../src/aws/PreprocessingHandler.js";

    const testPreprocessor = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new PreprocessingHandler(testPreprocessor, {
      title: "testPreprocessor",
      description: "Test preprocessor",
      timeout: 40,
      requiresProperties: [],
      memory: 4096,
    });
    `
    );
  }

  if (components.includes("syncGeoprocessor")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testSyncGeoprocessor.ts",
      ],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testSyncGeoprocessor.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/helpers";
    import { PreprocessingHandler } from "../../../../../src/aws/PreprocessingHandler.js";

    const testSyncGeoprocessor = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new PreprocessingHandler(testSyncGeoprocessor, {
      title: "testSyncGeoprocessor",
      description: "Test sync geoprocessor",
      timeout: 40,
      requiresProperties: [],
      memory: 4096,
    });
    `
    );
  }

  if (components.includes("asyncGeoprocessor")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testAsyncGeoprocessor.ts",
      ],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testAsyncGeoprocessor.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/helpers";
    import { PreprocessingHandler } from "../../../../../src/aws/PreprocessingHandler.js";

    const testAsyncGeoprocessor = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new PreprocessingHandler(testAsyncGeoprocessor, {
      title: "testAsyncGeoprocessor",
      description: "Test async geoprocessor",
      timeout: 40,
      requiresProperties: [],
      memory: 4096,
    });
    `
    );
  }

  fs.ensureDirSync(`${projectPath}/project`);
  fs.writeJSONSync(`${projectPath}/project/geoprocessing.json`, gpConfig);

  if (components.includes("client")) {
    gpConfig = {
      ...gpConfig,
      clients: [
        ...gpConfig.clients,
        {
          name: "TestClient",
          description: "client description",
          source: "src/clients/TestClient.tsx",
        },
      ],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testClient.ts`,
      `
      import React from "react";

      export const TestClient = () => {
        return (
          <div>Test</div>
        );
      };
    `
    );
  }

  await buildProjectFunctions(projectPath, `${projectPath}/.build`);
  const manifest = await fs.readJSONSync(`${projectPath}/.build/manifest.json`);
  return manifest as Manifest;
}

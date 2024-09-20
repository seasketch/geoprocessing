import { Package, GeoprocessingJsonConfig } from "../../src/types/index.js";
import { Manifest } from "../manifest.js";
import { TestComponentTypes } from "./types.js";
import { setupProjectDirs } from "../testing/lifecycle.js";
import fs from "fs-extra";
import { buildProjectFunctions } from "../build/buildProjectFunctions.js";
import { buildProjectClients } from "../build/buildProjectClients.js";

/**
 * Creates test project build, with the components requested, at project path and returns the resulting manifest
 */
export default async function createTestBuild(
  projectName: string,
  projectPath: string,
  /** test components to add */
  components: TestComponentTypes[],
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
  fs.writeJSONSync(`${projectPath}/package.json`, pkgGeo, { spaces: 2 });

  // Create project assets
  let gpConfig: GeoprocessingJsonConfig = {
    author: "Test <test@test.com>",
    organization: "Test Org",
    region: "us-west-1",
    preprocessingFunctions: [],
    geoprocessingFunctions: [],
    clients: [],
  };

  if (components.includes("preprocessor")) {
    gpConfig = {
      ...gpConfig,
      preprocessingFunctions: ["src/functions/testPreprocessor.ts"],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testPreprocessor.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/turf";
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
    `,
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
    import { point } from "@turf/turf";
    import { GeoprocessingHandler } from "../../../../../src/aws/GeoprocessingHandler.js";

    const testSyncGeoprocessor = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new GeoprocessingHandler(testSyncGeoprocessor, {
      title: "testSyncGeoprocessor",
      description: "Test sync geoprocessor",
      timeout: 40,
      requiresProperties: [],
      executionMode: "sync",
      memory: 4096,
    });
    `,
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
    import { point } from "@turf/turf";
    import { GeoprocessingHandler } from "../../../../../src/aws/GeoprocessingHandler.js";

    const testAsyncGeoprocessor = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new GeoprocessingHandler(testAsyncGeoprocessor, {
      title: "testAsyncGeoprocessor",
      description: "Test async geoprocessor",
      timeout: 40,
      requiresProperties: [],
      executionMode: "async",
      memory: 4096,
      workers: ['testWorker'],
    });
    `,
    );
  }

  if (components.includes("asyncGeoprocessorMissingWork")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testAsyncGeoprocessorMissingWork.ts",
      ],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testAsyncGeoprocessorMissingWork.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/turf";
    import { GeoprocessingHandler } from "../../../../../src/aws/GeoprocessingHandler.js";

    const testAsyncGeoprocessorMissingWork = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new GeoprocessingHandler(testAsyncGeoprocessorMissingWork, {
      title: "test",
      description: "Test async geoprocessor",
      timeout: 40,
      requiresProperties: [],
      executionMode: "async",
      memory: 4096
    });
    `,
    );
  }

  if (components.includes("asyncGeoprocessorTwoSameWorker")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testAsyncGeoprocessorTwo.ts",
      ],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testAsyncGeoprocessorTwo.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/turf";
    import { GeoprocessingHandler } from "../../../../../src/aws/GeoprocessingHandler.js";

    const testAsyncGeoprocessorTwo = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new GeoprocessingHandler(testAsyncGeoprocessorTwo, {
      title: "testAsyncGeoprocessorTwo",
      description: "Test async geoprocessor",
      timeout: 40,
      requiresProperties: [],
      executionMode: "async",
      memory: 4096,
      workers: ['testWorker'],
    });
    `,
    );
  }

  if (components.includes("asyncGeoprocessorWorker")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testAsyncGeoprocessorWorker.ts",
      ],
    };

    fs.writeFileSync(
      `${projectPath}/src/functions/testAsyncGeoprocessorWorker.ts`,
      `
    import { Feature, Point } from "geojson";
    import { point } from "@turf/turf";
    import { GeoprocessingHandler } from "../../../../../src/aws/GeoprocessingHandler.js";

    const testAsyncGeoprocessorWorker = async (feature: Feature<Point>) => {
      return point([0, 0]);
    };

    export default new GeoprocessingHandler(testAsyncGeoprocessorWorker, {
      title: "testWorker",
      description: "Test sync geoprocessor",
      timeout: 40,
      requiresProperties: [],
      executionMode: "sync",
      memory: 4096,
    });
    `,
    );
  }

  fs.ensureDirSync(`${projectPath}/project`);

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
      `${projectPath}/src/clients/TestClient.tsx`,
      `
      import React from "react";

      export const TestClient = () => {
        return (
          <div>Test</div>
        );
      };
      export default TestClient;
    `,
    );
  }

  fs.writeJSONSync(`${projectPath}/project/geoprocessing.json`, gpConfig, {
    spaces: 2,
  });

  await buildProjectFunctions(projectPath, `${projectPath}/.build`);

  if (components.includes("client")) {
    await buildProjectClients(projectPath, `${projectPath}/.build-web`);
  }
  const manifest = await fs.readJSONSync(`${projectPath}/.build/manifest.json`);
  return manifest as Manifest;
}

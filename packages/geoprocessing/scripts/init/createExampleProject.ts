import { createProject } from "./createProject";
import {
  makePreprocessingHandler,
  makeGeoprocessingHandler,
} from "./createFunction";
import { makeClient } from "./createClient";
import fs from "fs-extra";

const PROJECT_PATH = `packages/example-project`;

(async () => {
  const inLernaProjectRoot = await fs.pathExists("./lerna.json");
  if (!inLernaProjectRoot) {
    throw new Error(
      "createExampleProject is designed to be run from multi-project repo root."
    );
  }
  const pathExists = await fs.pathExists(PROJECT_PATH);
  if (pathExists) {
    await fs.remove(PROJECT_PATH);
  }
  await createProject(
    {
      name: "example-project",
      description: "Example project to test geoprocessing project scripts",
      author: "Test",
      email: "test@test.com",
      license: "UNLICENSED",
      organization: "Test Org",
      repositoryUrl: "https://github.com/seasketch/example-project",
      region: "us-west-1",
      templates: [],
      bbox: "[0, 0, 0, 0]",
      noun: "Samoa",
      nounPossessive: "Samoan",
    },
    false,
    PROJECT_PATH.split("/").slice(0, -1).join("/")
  );

  // sync geoprocessor
  await makeGeoprocessingHandler(
    {
      title: "area",
      typescript: true,
      description: "Produces the area of the given sketch",
      docker: false,
      executionMode: "sync",
    },
    false,
    PROJECT_PATH + "/"
  );

  // async geoprocessor
  await makeGeoprocessingHandler(
    {
      title: "areaAsync",
      typescript: true,
      description: "Produces the area of the given sketch - async",
      docker: false,
      executionMode: "async",
    },
    false,
    PROJECT_PATH + "/"
  );

  await fs.copyFile(
    `${__dirname}/../../../templates/exampleProject.test.ts`,
    PROJECT_PATH + "/src/exampleProject.test.ts"
  );

  await makeClient(
    {
      title: "AreaClient",
      description: "area report via sync function",
      typescript: true,
      functionName: "area",
    },
    false,
    PROJECT_PATH + "/"
  );

  await makeClient(
    {
      title: "AreaAsyncClient",
      description: "area report via async function",
      typescript: true,
      functionName: "areaAsync",
    },
    false,
    PROJECT_PATH + "/"
  );

  const pkg = JSON.parse(
    fs.readFileSync(PROJECT_PATH + "/package.json").toString()
  );
  pkg.private = true;
  const curGpVersion = JSON.parse(
    fs.readFileSync(`${__dirname}/../../../package.json`).toString()
  ).version;
  pkg.devDependencies["@seasketch/geoprocessing"] = curGpVersion;
  fs.writeFileSync(
    PROJECT_PATH + "/package.json",
    JSON.stringify(pkg, null, "  ")
  );
})();

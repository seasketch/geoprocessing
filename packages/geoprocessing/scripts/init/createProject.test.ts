import path from "path";
import fs from "fs-extra";
import { Manifest } from "../manifest";
import { createProject } from "./createProject";
import {
  makeGeoprocessingHandler,
  makePreprocessingHandler,
} from "./createFunction";
import { makeClient } from "./createClient";
import { GeoprocessingJsonConfig } from "../../src/types";

const projectName = "test-project";
const rootPath = `${__dirname}/__test__`;
const projectPath = path.join(rootPath, projectName);

afterAll(async () => {
  await fs.remove(rootPath); // Cleanup
});

it("should create project", async () => {
  await createProject(
    {
      name: projectName,
      description: "Test project",
      author: "Test",
      email: "test@test.com",
      license: "UNLICENSED",
      organization: "Test Org",
      repositoryUrl: "https://github.com/test/test-project",
      region: "us-west-1",
      templates: [],
    },
    false,
    rootPath
  );

  await makePreprocessingHandler(
    {
      title: "clipToBounds",
      typescript: true,
      description: "Clips a sketch to a bounding box",
    },
    false,
    projectPath + "/"
  );

  await makeGeoprocessingHandler(
    {
      title: "area",
      typescript: true,
      description: "Produces the area of the given sketch",
      docker: false,
      executionMode: "sync",
    },
    false,
    projectPath + "/"
  );

  await makeClient(
    {
      title: "AreaClient",
      description: "Area report client",
      typescript: true,
    },
    false,
    projectPath + "/"
  );

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectPath, "package.json")).toString()
  );

  expect(packageJson.name).toBe(projectName);
  expect(packageJson.description).toBe("Test project");
  expect(packageJson.license).toBe("UNLICENSED");
  expect(packageJson.author).toBe("Test");

  const gpConfig = JSON.parse(
    fs.readFileSync(projectPath + "/geoprocessing.json").toString()
  ) as GeoprocessingJsonConfig;

  expect(gpConfig.author).toBe("Test <test@test.com>");
  expect(gpConfig.organization).toBe("Test Org");
  expect(gpConfig.region).toBe("us-west-1");
  expect(gpConfig.preprocessingFunctions.length).toBe(1);
  expect(
    gpConfig.preprocessingFunctions.includes("src/functions/clipToBounds.ts")
  ).toBe(true);
  expect(gpConfig.geoprocessingFunctions.length).toBe(1);
  expect(
    gpConfig.geoprocessingFunctions.includes("src/functions/area.ts")
  ).toBe(true);
  expect(gpConfig.clients.length).toBe(1);
  expect(gpConfig.clients[0].name).toBe("AreaClient");
});

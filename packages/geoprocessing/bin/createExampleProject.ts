import makeProject from "./init";
import { makeGeoprocessingHandler } from "./createFunction";

import fs from "fs-extra";

const PATH = `packages/example-project`;

(async () => {
  const inLernaProjectRoot = await fs.pathExists("./lerna.json");
  if (!inLernaProjectRoot) {
    throw new Error(
      "createExampleProject is designed to be run from multi-project repo root."
    );
  }
  const pathExists = await fs.pathExists(PATH);
  if (pathExists) {
    await fs.remove(PATH);
  }
  await makeProject(
    {
      name: "example-project",
      description: "Example project to test geoprocessing project init scripts",
      author: "Chad Burt",
      email: "support@seasketch.org",
      license: "BSD-3-Clause",
      organization: "SeaSketch",
      repositoryUrl: "https://github.com/seasketch/example-project"
    },
    false,
    PATH.split("/")
      .slice(0, -1)
      .join("/")
  );
  await makeGeoprocessingHandler(
    {
      title: "area",
      typescript: true,
      description: "Produces the area of the given sketch",
      docker: false,
      executionMode: "sync"
    },
    false,
    PATH + "/"
  );
  await fs.copyFile(
    `${__dirname}/../../templates/exampleSketch.json`,
    PATH + "/examples/sketches/sketch.json"
  );
  await fs.copyFile(
    `${__dirname}/../../templates/exampleProject.test.ts`,
    PATH + "/src/exampleProject.test.ts"
  );
})();

import makeProject from "./init";
import { makeGeoprocessingHandler } from "./initGeoprocessingHandler";

import fs from "fs-extra";

const PATH = `packages`;

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
      email: "chad@underbluewaters.net",
      license: "MIT",
      organization: "SeaSketch",
      repositoryUrl: "https://github.com/seasketch/geoprocessing"
    },
    true,
    PATH
  );
  await makeGeoprocessingHandler(
    {
      title: "area",
      typescript: true,
      description: "Calculates the area of the given sketch",
      docker: false,
      executionMode: "sync"
    },
    false,
    PATH
  );
  await fs.copyFile(
    `${__dirname}/../../templates/exampleSketch.json`,
    PATH + "/examples/sketches/sketch.json"
  );
})();

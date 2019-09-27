import { configure } from "@storybook/react";
import { storyLoader as libraryStoryLoader } from "@seasketch/geoprocessing-client";

configure(
  [
    require.context("../src/client", true, /\.stories\.js$/),
    require.context("../src/client", true, /\.stories\.tsx$/)
  ],
  module
);

configure(libraryStoryLoader, module);

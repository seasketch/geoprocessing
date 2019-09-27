import { configure } from "@storybook/react";

configure(
  [
    require.context("../src/components", true, /\.stories\.js$/),
    require.context("../src/components", true, /\.stories\.tsx$/)
  ],
  module
);

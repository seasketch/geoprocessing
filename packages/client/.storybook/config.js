import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

// automatically import all files ending in *.stories.tsx
const req = require.context("../src/components", true, /\.stories\..+$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);

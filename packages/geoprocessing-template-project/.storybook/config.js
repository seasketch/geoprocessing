import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { loadStories as loadLibraryStories } from '@seasketch/geoprocessing-client';

// automatically import all files ending in *.stories.tsx
const req = require.context("../src/client", true, /\.stories\..+$/);

function loadStories() {
  req.keys().forEach(req);
  loadLibraryStories();
}

configure(loadStories, module);
addDecorator(withKnobs);


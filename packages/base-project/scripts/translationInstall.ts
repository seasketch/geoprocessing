#!/usr/bin/env zx

// Installs translations from geoprocessing library into local project

import fs from "fs-extra";
import path from "path";
import { $ } from "zx";
$.verbose = true;

const installedGpPath = path.join(
  import.meta.dirname,
  "../node_modules/@seasketch/geoprocessing"
);
const monoGpPath = path.join(
  import.meta.dirname,
  "../../../node_modules/@seasketch/geoprocessing"
);

const gpPath = (() => {
  if (fs.existsSync(installedGpPath)) {
    console.log(`Found geoprocessing library at ${installedGpPath}`);
    return installedGpPath;
  } else if (fs.existsSync(monoGpPath)) {
    console.log(`Found geoprocessing library at ${monoGpPath}`);
    return monoGpPath;
  }
  throw new Error(
    `Could not find path to geoprocessing library, tried ${installedGpPath} and ${monoGpPath}`
  );
})();

await $`rm -rf src/i18n/baseLang`;
// Update (overwrite) everything except lang directory
await $`cp -r ${gpPath}/dist/base-project/src/i18n/baseLang src/i18n`;
await $`cp -r ${gpPath}/dist/base-project/src/i18n/bin/* src/i18n/bin`;
await $`cp -r ${gpPath}/dist/base-project/src/i18n/*.* src/i18n`;

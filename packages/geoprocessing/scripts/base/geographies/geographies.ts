import fs from "fs-extra";
import path from "node:path";
import { geographiesSchema, Geographies } from "../../../src/types/index.js";
import { geographyConfig } from "../../../src/geographies/config.js";

/**
 * Manage geographies for a geoprocessing project
 */

/**
 * Reads geographies from disk, validates them, and returns deep copy.
 * If geographies file not exist then start a new one and ensure directory exists
 */
export function readGeographies(filePath?: string) {
  const geos: Geographies = [];

  // Optional override
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : geographyConfig.defaultSrcPath;

  const diskGeos = (() => {
    try {
      const geosString = fs.readFileSync(finalFilePath).toString();
      try {
        return JSON.parse(geosString);
      } catch {
        throw new Error(
          `Unable to parse JSON found in ${finalFilePath}, fix it and try again`,
        );
      }
    } catch {
      console.log(`Geography file not found at ${finalFilePath}`);
      fs.ensureDirSync(path.dirname(geographyConfig.defaultSrcPath));
      // fallback to default
      return geos;
    }
  })();

  const result = geographiesSchema.safeParse(diskGeos);
  if (result.success) {
    return result.data;
  } else {
    console.error("Geographies file is invalid, fix it and try again");
    console.log(JSON.stringify(result.error.issues, null, 2));
    throw new Error("Please fix or report this issue");
  }
}

/**
 * Writes geographies out to disk
 */
export function writeGeographies(geos: Geographies, filePath?: string) {
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : geographyConfig.defaultSrcPath;
  fs.writeJSONSync(finalFilePath, geos, { spaces: 2 });
}

import geoblaze from "geoblaze";
import { callWithRetry } from "../helpers/callWithRetry.js";
import { genPresignedUrl } from "./presignedUrl.js";
import "./fetchPolyfill.js";

/**
 * Returns cog-aware georaster at given url.  If fetch fails, will retry up to 3 times
 * Will not fetch raster values until subsequent geoblaze calls are made with
 * a geometry and it will calculate the window to load based on the geometry.
 * The subsequent geoblaze calls (e.g. sum) must be called async to allow the
 * raster to load.
 */
export const loadCog = async (url: string) => {
  if (process.env.NODE_ENV !== "test") console.log("loadCog", url);

  // Convert to presigned URL if running in Lambda with private S3 bucket
  const signedUrl = await genPresignedUrl(url);

  return await callWithRetry(geoblaze.parse, [signedUrl], {
    ifErrorMsgContains: "fetch failed",
  });
};

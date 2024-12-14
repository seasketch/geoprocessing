import geoblaze from "geoblaze";
import { callWithRetry } from "../helpers/callWithRetry.js";

/**
 * Returns cog-aware georaster at given url.  If fetch fails, will retry up to 3 times
 * Will not fetch raster values until subsequent geoblaze calls are made with
 * a geometry and it will calculate the window to load based on the geometry.
 * The subsequent geoblaze calls (e.g. sum) must be called async to allow the
 * raster to load.
 */
export const loadCog = async (url: string) => {
  if (process.env.NODE_ENV !== "test") console.log("loadCog", url);
  return await callWithRetry(geoblaze.parse, [url], {
    ifErrorMsgContains: "SocketError",
  });
};

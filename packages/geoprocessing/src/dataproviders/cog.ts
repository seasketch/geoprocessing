import geoblaze from "geoblaze";

/**
 * Returns cog-aware georaster at given url.  Will not fetch raster values
 * until subsequent geoblaze calls are made with a geometry and it will
 * calculate the window to load based on the geometry.  The subsequent
 * geoblaze calls (e.g. sum) must be called async to allow the raster to load.
 */
export const loadCog = async (url: string) => {
  if (process.env.NODE_ENV !== "test") console.log("loadCog", url);
  return geoblaze.parse(url);
};

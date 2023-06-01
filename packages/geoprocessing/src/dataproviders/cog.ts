import { BBox } from "../types";
// @ts-ignore
import parseGeoraster from "georaster";
// @ts-ignore
import geoblaze from "geoblaze";
import { maxWidth } from "../toolbox";
import buffer from "@turf/buffer";
import bboxPolygon from "@turf/bbox-polygon";
import bbox from "@turf/bbox";

interface CogOptions {
  noDataValue?: number;
  projection?: number;
  windowBox?: BBox;
  /** if window is smaller than one pixel, will buffer the widest dimension to the size of one pixel, ensuring at least one pixel is returned */
  bufferSmall?: boolean;
  /** optional buffer as percentage of max width of bbox of window, defaults to amount less than max pixel size + 20% of width */
  bufferWidthMultiple?: number;
}

/**
 * Returns cog-aware georaster at given url.  Will not fetch raster values
 * until subsequent geoblaze calls are made with a geometry and it will
 * calculate the window to load based on the geometry.  The subsequent
 * geoblaze calls (e.g. sum) must be called async to allow the raster to load.
 */
export const loadCog = async (url: string) => {
  console.log("loadCog", url);
  return geoblaze.parse(url);
};

/**
 * Returns georaster window (image subset) defined by options.windowBox, otherwise loads the whole raster
 * windowBox is extended out to the nearest pixel edge to (in theory) avoid resampling. Assumes raster is in WGS84 degrees
 * This function front loads the raster values, so subsequent geoblaze calls (e.g. sum) can be called sync
 * @deprecated
 * */
export const loadCogWindow = async (url: string, options: CogOptions) => {
  console.log("loadCogWindow", url, "options: ", JSON.stringify(options));
  const georaster = await parseGeoraster(url);
  // Default to meta parsed from raster
  const {
    windowBox = [
      georaster.xmin,
      georaster.ymin,
      georaster.xmax,
      georaster.ymax,
    ],
    noDataValue = georaster.noDataValue || 0,
    projection = georaster.projection || 4326,
    bufferSmall = true,
    bufferWidthMultiple = 0.2,
  } = options;

  console.log(`using bbox ${windowBox}`);

  // Calculate window in geographic and image coordinates
  const { image: finalWindow, bbox: finalBox } = ((box: BBox) => {
    // Special case buffer window smaller than pixel
    if (bufferSmall) {
      // get largest pixel dimension
      const maxResolution = Math.max(
        georaster.pixelHeight,
        georaster.pixelWidth
      );
      // Check if largest window dimension is smaller, or within .01 degrees of max pixel dimension
      // If so, buffer to make up the difference
      const diff = maxWidth(box) - maxResolution;
      if (diff < 0.01) {
        const radius = Math.abs(diff) + maxWidth(box) * bufferWidthMultiple;
        const bufPoly = buffer(bboxPolygon(box), radius, {
          units: "degrees",
        });
        const bufBox = bbox(bufPoly);
        return bboxToPixelEdge(bufBox, georaster);
      }
    }

    return bboxToPixelEdge(box, georaster);
  })(windowBox);

  const rasterOptions = {
    left: finalWindow.left,
    top: finalWindow.top,
    right: finalWindow.right,
    bottom: finalWindow.bottom,
    width: finalWindow.right - finalWindow.left,
    height: finalWindow.bottom - finalWindow.top,
    resampleMethod: "nearest",
  };

  // console.log("COG image options");
  // console.log(JSON.stringify(rasterOptions));

  if (!georaster.getValues)
    throw new Error(
      "Missing getValues method, did you forget to load the raster via url?"
    );
  const values = await georaster.getValues(rasterOptions);

  const xmin = finalBox[0];
  const ymax = finalBox[3];
  const pixelWidth = georaster.pixelWidth;
  const pixelHeight = georaster.pixelHeight;
  //
  const metadata = {
    noDataValue,
    projection,
    xmin,
    ymax,
    pixelWidth,
    pixelHeight,
  };
  // console.log("COG metadata");
  // console.log(metadata);
  const raster = await parseGeoraster(values, metadata);
  return raster;
};

/**
 * Finds boundary of raster window in pixel coordinates given bbox.
 * Extends out to nearest whole image pixel edge and returns both image
 * and geographic coordinates at that edge.
 */
const bboxToPixelEdge = (bbox: number[], rasterMeta: any) => {
  // COG window
  // Image coordinates start in top left, which is 0, 0 and go down and to the right
  // georaster  - { left: 0, top: 0, right: 4000, bottom: 4000, width: 10, height: 10 }

  // Calculate whole window image coordinates
  const image = {
    left: Math.floor((bbox[0] - rasterMeta.xmin) / rasterMeta.pixelWidth),
    bottom: Math.ceil((rasterMeta.ymax - bbox[1]) / rasterMeta.pixelHeight),
    right: Math.ceil((bbox[2] - rasterMeta.xmin) / rasterMeta.pixelWidth),
    top: Math.floor((rasterMeta.ymax - bbox[3]) / rasterMeta.pixelHeight),
  };

  // Geographic coordinates start in bottom left
  // [xmin, ymin, xmax, ymax]
  // [left, bottom, right, top]

  // Convert whole image coordinates back to geographic
  const imageBbox = [
    rasterMeta.xmin + image.left * rasterMeta.pixelWidth,
    rasterMeta.ymax - image.bottom * rasterMeta.pixelHeight,
    rasterMeta.xmin + image.right * rasterMeta.pixelWidth,
    rasterMeta.ymax - image.top * rasterMeta.pixelHeight,
  ];
  return { image, bbox: imageBbox };
};

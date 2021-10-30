import { BBox } from "../types";
// @ts-ignore
import parseGeoraster from "georaster";
import { maxWidth } from "../toolbox";
import buffer from "@turf/buffer";
import bboxPolygon from "@turf/bbox-polygon";
import bbox from "@turf/bbox";
import { featureCollection } from "@turf/helpers";

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
 * Returns the raster subset defined by the bbox, otherwise loads the whole raster
 * */
export const loadCogWindow = async (url: string, options: CogOptions) => {
  const georaster = await parseGeoraster(url);
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

  const window = ((box: BBox) => {
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
        return bboxToPixel(bufBox, georaster);
      }
    }
    return bboxToPixel(box, georaster);
  })(windowBox);

  const rasterOptions = {
    left: window.left,
    top: window.top,
    right: window.right,
    bottom: window.bottom,
    width: window.right - window.left,
    height: window.bottom - window.top,
    resampleMethod: "nearest",
  };

  if (!georaster.getValues)
    throw new Error(
      "Missing getValues method, did you forget to load the raster via url?"
    );
  const values = await georaster.getValues(rasterOptions);

  const xmin = windowBox[0];
  const ymax = windowBox[3];
  const pixelWidth = georaster.pixelWidth;
  const pixelHeight = georaster.pixelHeight;
  const metadata = {
    noDataValue,
    projection,
    xmin,
    ymax,
    pixelWidth,
    pixelHeight,
  };
  return await parseGeoraster(values, metadata);
};

const bboxToPixel = (bbox: number[], georaster: any) => {
  return {
    left: Math.floor((bbox[0] - georaster.xmin) / georaster.pixelWidth),
    bottom: Math.floor((georaster.ymax - bbox[1]) / georaster.pixelHeight),
    right: Math.floor((bbox[2] - georaster.xmin) / georaster.pixelWidth),
    top: Math.floor((georaster.ymax - bbox[3]) / georaster.pixelHeight),
  };
};

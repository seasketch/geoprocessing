import { BBox } from "../types";
// @ts-ignore
import parseGeoraster from "georaster";

interface CogOptions {
  noDataValue?: number;
  projection?: number;
  windowBox?: BBox;
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
    noDataValue = 0,
    projection = 4326,
  } = options;

  const window = bboxToPixel(windowBox, georaster);

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

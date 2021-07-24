import { BBox } from "../types";
// @ts-ignore
import parseGeoraster from "georaster";

/**
 * Returns the raster subset defined by the bbox, otherwise loads the whole raster
 * */
export const loadCogWindow = async (url: string, bbox?: BBox) => {
  const georaster = await parseGeoraster(url);

  const windowBox = bbox
    ? bbox
    : [georaster.xmin, georaster.ymin, georaster.xmax, georaster.ymax];
  const window = bboxToPixel(windowBox, georaster);

  const options = {
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
  const values = await georaster.getValues(options);

  const noDataValue = 0;
  const projection = 4326;
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

//@ts-ignore
import geoblaze from "geoblaze";

//import { parseGeoraster } from "georaster";
import { Sketch } from "@seasketch/geoprocessing";

export async function getRasterSumInSketch(
  urlOrFile: string,
  sketch: Sketch
): Promise<number> {
  let sum: number = -2;
  try {
    let georaster = await geoblaze.load(urlOrFile);
    sum = await geoblaze.sum(georaster, sketch.geometry);
  } catch (err) {
    console.warn("error with sum: ", err);
    sum = -1;
  }
  return sum;
}

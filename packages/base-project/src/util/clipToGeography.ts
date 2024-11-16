import {
  Polygon,
  MultiPolygon,
  Sketch,
  SketchCollection,
  toSketchArray,
  Geography,
  Feature,
  isSketchCollection,
  genSketchCollection,
  getFeatures,
} from "@seasketch/geoprocessing";
import { bbox, featureCollection, simplify } from "@turf/turf";
import project from "../../project/projectClient.js";
import {
  clipMultiMerge,
  zeroSketchArray,
  zeroPolygon,
} from "@seasketch/geoprocessing";

/**
 * Returns intersection of sketch with geography features.
 * If sketch does not overlap with geography returns sketch with zero polygon geometry (null island)
 * @param sketch Sketch or SketchCollection
 * @param geography geography to clip sketch to, geography features are fetched
 * @param options optionally simplify sketch
 * @param simplifyOptions.tolerance tolerance in meters
 * @param simplifyOptions.highQuality highQuality simplification
 * @returns Sketch | SketchCollection
 * @throws if geography has no features
 */
export async function clipToGeography<G extends Polygon | MultiPolygon>(
  sketch: Sketch<G> | SketchCollection<G>,
  geography: Geography,
  options?: { tolerance?: number; highQuality?: boolean },
): Promise<Sketch<G> | SketchCollection<G>> {
  if (!geography) {
    if (options) return simplify(sketch, options);
    else return sketch;
  }

  const box = sketch.bbox || bbox(sketch);
  // ToDo: need to support external geography too, can we borrow logic from precalc
  const ds = project.getVectorDatasourceById(geography.datasourceId);
  // ToDo - accept array of geographies and union all their features, then intersect with sketch
  const geogFeatures = await getFeatures<Feature<Polygon | MultiPolygon>>(
    ds,
    project.getDatasourceUrl(ds),
    {
      bbox: box,
    },
  );

  let finalSketches: Sketch<G>[] = [];

  if (geogFeatures[0]) {
    const sketches = toSketchArray(sketch);
    for (const sketch of sketches) {
      const intersection = clipMultiMerge(
        sketch,
        featureCollection(geogFeatures),
        "intersection",
      ) as Feature<G>;
      if (!intersection)
        console.log(
          `Sketch ${sketch.id} does not intersect with geography ${geography.geographyId}`,
        );
      if (intersection) {
        if (options) {
          sketch.geometry = simplify(intersection.geometry, options);
          sketch.bbox = bbox(intersection);
        } else {
          sketch.geometry = intersection.geometry;
          sketch.bbox = bbox(intersection);
        }
      } else {
        sketch.geometry = zeroPolygon() as G;
        sketch.bbox = [0, 0, 0, 0];
      }
      finalSketches.push(sketch);
    }
  } else {
    console.log(
      sketch.properties.name,
      "has no overlap with geography",
      geography.geographyId,
    );

    finalSketches = zeroSketchArray(toSketchArray(sketch));

    if (isSketchCollection(sketch)) {
      return {
        properties: sketch.properties,
        bbox: [0, 0, 0, 0],
        type: "FeatureCollection",
        features: finalSketches,
      };
    } else {
      return { ...finalSketches[0], bbox: [0, 0, 0, 0] };
    }
  }

  if (isSketchCollection(sketch)) {
    return {
      properties: sketch.properties,
      bbox: bbox(
        genSketchCollection(
          finalSketches.filter((sk) => !sk.bbox!.every((coord) => coord === 0)),
        ),
      ),
      type: "FeatureCollection",
      features: finalSketches,
    };
  } else {
    return finalSketches[0];
  }
}

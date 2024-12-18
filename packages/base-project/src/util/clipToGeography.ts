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
  getDatasourceFeatures,
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
 * If sketch does not overlap with geography returns sketch with zero polygon
 * geometry (null island).  This to ensure that the sketch is still valid and
 * effectively a no-op in follow-on spatial operations.
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
  const ds = project.getVectorDatasourceById(geography.datasourceId);
  const geogFeatures = await getDatasourceFeatures<Polygon | MultiPolygon>(
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
      if (!intersection && process.env.NODE_ENV !== "test") {
        console.log(
          `Sketch ${sketch.id} does not intersect with geography ${geography.geographyId}`,
        );
      }
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
    if (process.env.NODE_ENV !== "test") {
      console.log(
        sketch.properties.name,
        "has no overlap with geography",
        geography.geographyId,
      );
    }

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
          finalSketches.filter((sk) => !sk.bbox!.every((coord) => coord === 0)), // filter out zero sketches
        ),
      ),
      type: "FeatureCollection",
      features: finalSketches,
    };
  } else {
    return finalSketches[0];
  }
}

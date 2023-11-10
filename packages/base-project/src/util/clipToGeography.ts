import {
  Polygon,
  MultiPolygon,
  Sketch,
  SketchCollection,
  toSketchArray,
  Geography,
  Feature,
  isSketchCollection,
} from "@seasketch/geoprocessing/client-core";
import { getFeatures } from "@seasketch/geoprocessing/dataproviders";
import { featureCollection } from "@turf/helpers";
import bbox from "@turf/bbox";
import project from "../../project";
import {
  clipMultiMerge,
  zeroSketchArray,
  zeroPolygon,
} from "@seasketch/geoprocessing";
import simplify from "@turf/simplify";

/**
 * Clips sketch to geography
 * @param sketch Sketch or SketchCollection
 * @param geography geography to clip sketch to
 * @param simplifyOptions optionally simplify sketch
 * @param simplifyOptions.tolerance tolerance in meters
 * @param simplifyOptions.highQuality highQuality simplification
 * @returns Sketch | SketchCollection
 * @throws if geography has no features
 */
export async function clipToGeography<G extends Polygon | MultiPolygon>(
  sketch: Sketch<G> | SketchCollection<G>,
  geography: Geography,
  simplifyOptions?: { tolerance?: number; highQuality?: boolean }
): Promise<Sketch<G> | SketchCollection<G>> {
  if (!geography) {
    if (simplifyOptions) return simplify(sketch, simplifyOptions);
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
    }
  );

  let finalSketches: Sketch<G>[] = [];

  if (!geogFeatures[0]) {
    console.log(
      sketch.properties.name,
      "has no overlap with geography",
      geography.geographyId
    );

    finalSketches = zeroSketchArray(toSketchArray(sketch));

    if (isSketchCollection(sketch)) {
      return {
        properties: sketch.properties,
        bbox: box,
        type: "FeatureCollection",
        features: finalSketches,
      };
    } else {
      return finalSketches[0];
    }
  } else {
    const sketches = toSketchArray(sketch);
    sketches.forEach((sketch) => {
      const intersection = clipMultiMerge(
        sketch,
        featureCollection(geogFeatures),
        "intersection"
      ) as Feature<G>;
      if (!intersection)
        console.log(
          `Sketch ${sketch.id} does not intersect with geography ${geography.geographyId}`
        );
      if (intersection) {
        if (simplifyOptions) {
          sketch.geometry = simplify(intersection.geometry, simplifyOptions);
        } else {
          sketch.geometry = intersection.geometry;
        }
      } else {
        sketch.geometry = zeroPolygon() as G;
      }
      finalSketches.push(sketch);
    });
  }

  if (isSketchCollection(sketch)) {
    return {
      properties: sketch.properties,
      bbox: box,
      type: "FeatureCollection",
      features: finalSketches,
    };
  } else {
    return finalSketches[0];
  }
}

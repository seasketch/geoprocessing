//the intersect derived from turf intersect is full of type errs
import { Sketch } from "../types";

import {
  Polygon,
  FeatureCollection,
  MultiPolygon,
  Feature,
  GeoJsonProperties,
  Geometry,
} from "geojson";

//@ts-ignore
import booleanOverlap from "@turf/boolean-overlap";
import buffer from "@turf/buffer";
import * as helpers from "@turf/helpers";
import * as invariant from "@turf/invariant";

import * as martinez from "martinez-polygon-clipping";

export function addProps(
  propNames: string[],
  propsToInclude: { [k: string]: string },
  feat: Feature<Geometry, GeoJsonProperties>
): { [k: string]: string } {
  for (let p of propNames) {
    let pName = feat?.properties?.[p];
    propsToInclude[p] = pName;
  }
  return propsToInclude;
}

export const getSketchIntersectList = (
  sketch: Sketch,
  data: FeatureCollection | Feature[],
  propNamesToInclude: string[]
): FeatureCollection<Geometry, GeoJsonProperties> => {
  let f2: Feature[];
  if ("type" in data && data.type == "FeatureCollection") {
    f2 = data.features;
  } else {
    f2 = data as Feature[];
  }

  let overlappingList: Feature<Geometry, GeoJsonProperties>[] = [];
  let poly1 = sketch.geometry;

  let p1Poly = buffer(sketch as Feature, 0);

  //let p1Poly = sketch.geometry as Polygon | MultiPolygon;
  for (let j = 0; j < f2.length; j++) {
    let poly2 = f2[j];

    let noOverlap = false;
    if (!noOverlap) {
      let newProps: { [k: string]: string } = {};
      if (propNamesToInclude?.length > 0) {
        newProps = addProps(propNamesToInclude, newProps, poly2 as Feature);
      } else {
        newProps = {};
      }
      let p2Poly;
      try {
        p2Poly = buffer(poly2, 0);
      } catch (err) {
        continue;
      }

      //let p2Poly = sketch.geometry as Polygon | MultiPolygon;
      if (p1Poly != null && p2Poly != null) {
        try {
          let overlap = intersect(
            p1Poly.geometry as Polygon | MultiPolygon,
            p2Poly.geometry as Polygon | MultiPolygon
          );
          let feature: Feature = {
            type: "Feature",
            properties: newProps,
            geometry: overlap?.geometry as Polygon | MultiPolygon,
          };

          if (overlap != null) {
            overlappingList.push(feature);
          }
        } catch (err) {
          console.log("blew up while intersecting, skipping this polygon");
        }
      }
    }
  }

  let featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: overlappingList,
  };

  return featureCollection;
};

export const getIntersectList = (
  data1: FeatureCollection,
  data2: FeatureCollection,
  propNamesToInclude: string[]
): FeatureCollection<Geometry, GeoJsonProperties> => {
  let f1: Feature[] = data1.features;

  let f2: Feature[] = data2.features;

  let overlappingList: Feature<Geometry, GeoJsonProperties>[] = [];
  for (let i = 0; i < f1.length; i++) {
    let poly1 = f1[i];

    let newProps: { [k: string]: string } = {};
    let geom1: Polygon | MultiPolygon = poly1.geometry as
      | Polygon
      | MultiPolygon;

    if (propNamesToInclude?.length > 0) {
      newProps = addProps(propNamesToInclude, newProps, poly1 as Feature);
    } else {
      newProps = {};
    }
    try {
      //let p1Poly = poly1.geometry as Polygon | MultiPolygon;
      let p1Poly = buffer(geom1, 0.0001);

      //let p1PolyFeat = buffer(poly1, 0);
      for (let j = 0; j < f2.length; j++) {
        let poly2 = f2[j];

        let noOverlap = false;
        //speedup to see if the bounding box doesnt overlap, then dont bother intersecting
        if (!noOverlap) {
          let geom2: Polygon | MultiPolygon = poly2.geometry as
            | Polygon
            | MultiPolygon;

          //buffering by zero results in an occassional heap overflow. buffer by a tiny amount...

          try {
            let p2Poly = buffer(geom2, 0.00001);
            if (geom1 != null && geom2 != null) {
              let overlap = intersect(
                p1Poly.geometry as Polygon | MultiPolygon,
                p2Poly.geometry as Polygon | MultiPolygon
              );

              let feature: Feature = {
                type: "Feature",
                properties: newProps,
                geometry: overlap?.geometry as Polygon | MultiPolygon,
              };

              if (
                overlap != null &&
                overlap.geometry?.coordinates?.length > 0
              ) {
                overlappingList.push(feature);
              }
            }
          } catch (err) {
            //occassional complaints about rings less than 4 points...
            //need to figure out what is causing this...
            console.log("skipping invalid geometry for buffer/intersect");
          }
        }
      }
    } catch (err) {
      console.log("error trying to buffer p1, skipping this one");
    }
  }

  let featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: overlappingList,
  };
  return featureCollection;
};

function doPolyAndMulitPolyOverlap(
  data1: Polygon,
  data2: MultiPolygon
): boolean {
  let geom = data2.coordinates;
  for (const coord of data2.coordinates) {
    let poly: Polygon = {
      type: "Polygon",
      coordinates: coord,
    };
    let boolOverlap = booleanOverlap(data1, poly);
    if (boolOverlap) {
      return true;
    }
  }
  return false;
}

function doMultiAndMultiPolyOverlap(
  data1: MultiPolygon,
  data2: MultiPolygon
): boolean {
  for (const d1Coord of data2.coordinates) {
    if (d1Coord?.length < 3) {
      continue;
    }
    let d1Poly: Polygon = {
      type: "Polygon",
      coordinates: d1Coord,
    };
    for (const d2Coord of data2.coordinates) {
      if (d2Coord?.length < 3) {
        continue;
      }
      let d2Poly: Polygon = {
        type: "Polygon",
        coordinates: d2Coord,
      };
      let boolOverlap = booleanOverlap(d1Poly, d2Poly);
      if (boolOverlap) {
        return true;
      }
    }
  }
  return false;
}
function doBooleanOverlap(
  data1: Polygon | MultiPolygon,
  data2: Polygon | MultiPolygon
): boolean {
  let d1 = data1;
  let d2 = data2;

  if (data1.type == "Polygon" && data2.type == "Polygon") {
    return booleanOverlap(d1, d2);
  } else if (data2.type == "Polygon" && data1.type == "MultiPolygon") {
    return doPolyAndMulitPolyOverlap(d2 as Polygon, d1 as MultiPolygon);
  } else if (d1.type == "Polygon" && d2.type == "MultiPolygon") {
    return doPolyAndMulitPolyOverlap(d1 as Polygon, d2 as MultiPolygon);
  } else if (data1.type == "MultiPolygon" && data2.type == "MultiPolygon") {
    return doMultiAndMultiPolyOverlap(d1 as MultiPolygon, d2 as MultiPolygon);
  } else {
    console.log("shouldnt get here...");
    return true;
  }
}

//@ts-ignore
//this is copied from @turf/intersect, but uses the newer martinez installed
//the martinez intersect problem is fixed in this version...

export const intersect = (poly1, poly2) => {
  let options = {};

  var geom1 = invariant.getGeom(poly1);
  var geom2 = invariant.getGeom(poly2);
  if (geom1.type === "Polygon" && geom2.type === "Polygon") {
    var intersection = martinez.intersection(
      geom1.coordinates,
      geom2.coordinates
    );
    if (intersection === null || intersection.length === 0) {
      return null;
    }
    if (intersection.length === 1) {
      var start = intersection[0][0][0];
      var end = intersection[0][0][intersection[0][0].length - 1];
      //make sure the polygon is valid -- it is closed and has more than 3 points
      //@ts-ignore
      if (start[0] === end[0] && start[1] === end[1]) {
        try {
          //@ts-ignore
          return helpers.polygon(intersection[0], options.properties);
        } catch (err) {
          return null;
        }
      }
      return null;
    }
    //@ts-ignore
    return helpers.multiPolygon(intersection, options.properties);
  } else if (geom1.type === "MultiPolygon") {
    //@ts-ignore
    var resultCoords = [];
    // iterate through the polygon and run intersect with each part, adding to the resultCoords.
    for (var _i = 0, _a = geom1.coordinates; _i < _a.length; _i++) {
      var coords = _a[_i];
      var subGeom = invariant.getGeom(helpers.polygon(coords));
      //@ts-ignore
      var subIntersection = intersect(subGeom, geom2);
      if (subIntersection) {
        //@ts-ignore
        var subIntGeom = invariant.getGeom(subIntersection);
        if (subIntGeom.type === "Polygon") {
          //@ts-ignore
          resultCoords.push(subIntGeom.coordinates);
        } else if (subIntGeom.type === "MultiPolygon") {
          //@ts-ignore
          resultCoords = resultCoords.concat(subIntGeom.coordinates);
        } else {
          throw new Error("intersection is invalid");
        }
      }
    }
    // Make a polygon with the result
    if (resultCoords.length === 0) {
      return null;
    }
    if (resultCoords.length === 1) {
      //@ts-ignore
      return helpers.polygon(resultCoords[0], options.properties);
    } else {
      //@ts-ignore
      return helpers.multiPolygon(resultCoords, options.properties);
    }
  } else if (geom2.type === "MultiPolygon") {
    // geom1 is a polygon and geom2 a multiPolygon,
    // put the multiPolygon first and fallback to the previous case.
    //@ts-ignore
    return intersect(geom2, geom1);
  } else {
    // handle invalid geometry types
    throw new Error("poly1 and poly2 must be either polygons or multiPolygons");
  }
};

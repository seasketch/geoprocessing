import { Position } from "geojson";
import { feature, featureCollection, getCoords, getType } from "@turf/turf";

/**
 * Cleans geojson coordinates to be within the bounds of the world [-90, -180, 90, 180], so that they don't wrap off the end, and can be split
 * @param geojson
 * @param options
 * @param options.mutate whether or not to mutate the coordinates in place, defaults to false
 */
export function cleanCoords(
  geojson: any,
  options: {
    mutate?: boolean;
  } = {},
) {
  var mutate = typeof options === "object" ? options.mutate : options;
  if (!geojson) throw new Error("geojson is required");
  var type = getType(geojson);

  // Store new "clean" points in this Array
  var newCoords: any = [];

  switch (type) {
    case "FeatureCollection":
      const cleanedCollection = featureCollection(
        geojson.features.map((f) => cleanCoords(f)),
      );
      if (geojson.properties) {
        // @ts-ignore
        cleanedCollection.properties = geojson.properties; // if SketchCollection transfer properties
        // @ts-ignore
        cleanedCollection.bbox = geojson.bbox; // and bbox
      }
      return cleanedCollection;
    case "LineString":
      newCoords = cleanLine(geojson, type);
      break;
    case "MultiLineString":
    case "Polygon":
      getCoords(geojson).forEach(function (line) {
        newCoords.push(cleanLine(line, type));
      });
      break;
    case "MultiPolygon":
      getCoords(geojson).forEach(function (polygons: any) {
        var polyPoints: Position[] = [];
        polygons.forEach(function (ring: Position[]) {
          polyPoints.push(cleanLine(ring, type));
        });
        newCoords.push(polyPoints);
      });
      break;
    case "Point":
      return geojson;
    case "MultiPoint":
      var existing: Record<string, true> = {};
      getCoords(geojson).forEach(function (coord: any) {
        var key = coord.join("-");
        if (!Object.prototype.hasOwnProperty.call(existing, key)) {
          newCoords.push(coord);
          existing[key] = true;
        }
      });
      break;
    default:
      throw new Error(type + " geometry not supported");
  }

  // Support input mutation
  if (geojson.coordinates) {
    if (mutate === true) {
      geojson.coordinates = newCoords;
      return geojson;
    }
    return { type: type, coordinates: newCoords };
  } else {
    if (mutate === true) {
      geojson.geometry.coordinates = newCoords;
      return geojson;
    }
    return feature({ type: type, coordinates: newCoords }, geojson.properties, {
      bbox: geojson.bbox,
      id: geojson.id,
    });
  }
}

/**
 * Clean line
 * @param {Array<number>|LineString} line Line
 * @param {string} type Type of geometry
 * @returns {Array<number>} Cleaned coordinates
 */
function cleanLine(line: Position[], type: string): any[] {
  var points = getCoords(line);
  var newPoints: number[][] = [];
  for (var i = 0; i < points.length; i++) {
    const newPoint = [longitude(points[i][0]), latitude(points[i][1])];
    newPoints.push(newPoint);
  }
  return newPoints;
}

/**
 * Clean latitude coordinate
 * @param lat
 * @returns latitude value within -90 to 90
 */
function latitude(lat: number) {
  if (lat === undefined || lat === null) throw new Error("lat is required");

  // Latitudes cannot extends beyond +/-90 degrees
  if (lat > 90 || lat < -90) {
    lat = lat % 180;
    if (lat > 90) lat = -180 + lat;
    if (lat < -90) lat = 180 + lat;
    if (lat === 0) lat = Math.abs(lat); // make sure not negative zero
  }
  return lat;
}

/**
 * Clean longitude coordinate
 * @param lng
 * @returns longitude value within -180 to 180
 */
function longitude(lng: number) {
  if (lng === undefined || lng === undefined)
    throw new Error("lng is required");

  // lngitudes cannot extends beyond +/-90 degrees
  if (lng > 180 || lng < -180) {
    lng = lng % 360;
    if (lng > 180) lng = -360 + lng;
    if (lng < -180) lng = 360 + lng;
    if (lng === 0) lng = Math.abs(lng); // make sure not negative zero
  }
  return lng;
}

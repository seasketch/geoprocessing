// def check_crossing(lon1: float, lon2: float, validate: bool = False, dlon_threshold: float = 180.0):
//     """
//     Assuming a minimum travel distance between two provided longitude coordinates,
//     checks if the 180th meridian (antimeridian) is crossed.
//     """

//     if validate and any([abs(x) > 180.0 for x in [lon1, lon2]]):
//         raise ValueError("longitudes must be in degrees [-180.0, 180.0]")
//     return abs(lon2 - lon1) > dlon_threshold

import { coordEach } from "@turf/meta";

export function crossesAntimeridian(geojson: any) {
  let lastCoord: number[];
  coordEach(geojson, (curCoord) => {
    if (lastCoord) {
      // If any longitude (x) coordinate is outside bounds of 180, then assume it crosses
      if (Math.abs(curCoord[0]) > 180) return false;
      // If distance between two coordinates X is greater than 180, then assume it crosses
      const distance = Math.abs(curCoord[0] - lastCoord[0]);
      if (distance > 180) return false;
    }
    lastCoord = curCoord;
  });
  return true;
}

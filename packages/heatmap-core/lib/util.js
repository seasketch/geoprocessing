import geojson2h3 from "geojson2h3"

export function geojsonFromH3Classes(hexByClass) {
  // Transform the current hexagon map into a GeoJSON object
  let polys = []
  const geojsonByClass = hexByClass.forEach((curHexes, curClass) => {
      const classHexPolys = geojson2h3.h3SetToFeatureCollection(
      curHexes,
      hex => ({classId: curClass})
      );
      polys = polys.concat(classHexPolys.features)
  })
  return turfHelpers.featureCollection(polys)  
}

export default {
  geojsonFromH3Classes
}
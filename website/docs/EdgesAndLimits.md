# Accuracy/Limitations

### Javascript-only

- The geoprocessing library currently only supports geoprocessing functions that run in a NodeJS environment. You have the ability to invoke any Lambda function, the framework just doesn't have first class support for writing and publishing functions in any other languages.

### Coordinate System Support

- Vector data, on import, is converted to WGS 84 (EPSG 4326). Vector toolbox functions expect data to be in this projection.
- Raster data, on import, is converted to an equal area projection (NSIDC EASE-Grid 2.0 Global)[https://epsg.io/6933]. Raster toolbox functions should work with any grid-based projection but anything other than equal area will have accuract issues.

- Geoprocessing functions in this library currently only support GeoJSON data in the World Geodetic System 1984 (WGS 84) [WGS84] datum (aka Lat/Lon), with longitude and latitude units of decimal degrees.

### Calculation Error

#### TurfJS

TurfJS vector function (particularly those that use [Turf.JS](http://turfjs.org/docs/#distance)) measure distance and area by approximating them on a sphere. Turf.js functions strike a balance between speed and accuracy.

- If the geographic area of your project is small, on the order of a few hundred to a thousand miles, and not at high latitudes (> 60), then the accuracy will be quite good, and the error quite small (within 5%) compared to more exact algorithms.
- And if your planning objectives target creating areas that capture a given % of something, for example 20% of the rocky reef habitat in the entire planning area, then the effect of error in area calculations should be **minimal to none**.

Sources:

- [Fast Geodesic Approximations](https://blog.mapbox.com/fast-geodesic-approximations-with-cheap-ruler-106f229ad016)
- [Calculate distance, bearing and more between Latitude/Longitude points](https://www.movable-type.co.uk/scripts/latlong.html)
- [Haversine Formula on Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula). Used by [turf-distance](https://github.com/Turfjs/turf/tree/master/packages/turf-distance). Error up to 0.5%
- [Some algorithms for polygons on a sphere](https://sgp1.digitaloceanspaces.com/proletarian-library/books/5cc63c78dc09ee09864293f66e2716e2.pdf) - used by [turf-area](http://turfjs.org/docs/#area). Greater error at higher latitudes vs. Vincenty.
- [Vincenty algorithm](https://en.wikipedia.org/wiki/Vincenty%27s_formulae) used by [turf-vincenty-inverse](https://github.com/Turfjs/turf-vincenty-inverse)
- [GeoJSON spec WGS84 requirement](https://datatracker.ietf.org/doc/html/rfc7946#section-4).

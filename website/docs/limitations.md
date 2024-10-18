# Accuracy/Limitations

## Javascript-only

- The current version of the library only supports spatial analysis libraries that run in a NodeJS environment. This includes [Turf JS](http://turfjs.org/), [Geoblaze](https://geoblaze.io/), [cheap-ruler](https://github.com/mapbox/cheap-ruler) and anything else you can find. There is discussion about supporting any analysis that can be packaged into a Docker container now that Lambda has [added container support](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/). This will be done as need arises.

## Coordinate System Support

- Vector data, on import, is converted to WGS 84 (EPSG 4326). Vector toolbox functions expect data to be in this projection.
- Raster data, on import, is converted to an equal area projection (NSIDC EASE-Grid 2.0 Global)[https://epsg.io/6933]. Raster toolbox functions should work with any grid-based projection but anything other than equal area will have accuract issues.

- Geoprocessing functions in this library currently only support GeoJSON data in the World Geodetic System 1984 (WGS 84) [WGS84] datum (aka Lat/Lon), with longitude and latitude units of decimal degrees.

## Calculation Error

Since the data is spherical (WGS84), most toolbox functions in this library (particularly those that use [Turf.JS](http://turfjs.org/docs/#distance)) measure distance and area by approximating them on a sphere. Algorithms are typically chosen that strike a balance between speed and accuracy.

- If the geographic area of your project is small, on the order of a few hundred to a thousand miles, and not at high latitudes, then error is relatively small.
- Reporting the percentage of an area is not subject to the error of the algorithm for calculating the area. For example, if you write a function to calculate the % of a particular habitat captured by a polygon that overlaps the habitat, as long as the area of the total habitat, and the area overlapping the habitat are calculated using the same formula, then the percentage of the two should be the same as if it were calculated using a more accurate area formula.

Sources:

- [Fast Geodesic Approximations](https://blog.mapbox.com/fast-geodesic-approximations-with-cheap-ruler-106f229ad016)
- [Calculate distance, bearing and more between Latitude/Longitude points](https://www.movable-type.co.uk/scripts/latlong.html)
- [Haversine Formula on Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula). Used by [turf-distance](https://github.com/Turfjs/turf/tree/master/packages/turf-distance). Error up to 0.5%
- [Some algorithms for polygons on a sphere](https://sgp1.digitaloceanspaces.com/proletarian-library/books/5cc63c78dc09ee09864293f66e2716e2.pdf) - used by [turf-area](http://turfjs.org/docs/#area). Greater error at higher latitudes vs. Vincenty.
- [Vincenty algorithm](https://en.wikipedia.org/wiki/Vincenty%27s_formulae) used by [turf-vincenty-inverse](https://github.com/Turfjs/turf-vincenty-inverse)
- [GeoJSON spec WGS84 requirement](https://datatracker.ietf.org/doc/html/rfc7946#section-4).

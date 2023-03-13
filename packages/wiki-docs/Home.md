Table of Contents

* [Concepts](Concepts)
* [Tutorials](Tutorials)
* [Tips and Tricks](Tipsandtricks)
* [Extending](Extending)
* [Architecture](Architecture)
* [Contributing](Contributing)

* [API Docs](https://seasketch.github.io/geoprocessing/api)
* [UI Component Library](https://seasketch.github.io/geoprocessing/storybook)

# License

Geoprocessing source code is licensed under a [BSD 3-clause license](../../LICENSE) and any reuse or modifications must retain this license with copyright notice.

Wiki docs, including any code snippets in tutorials, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

# Features

* Cloud-native serverless architecture
* Plug-and-play with SeaSketch platform
* End-to-end support and use of [Typescript](https://www.typescriptlang.org/)
* Project generator with templates and built-in commands for common project tasks
* Library of [React](https://reactjs.org/) UI components ready to add to reports.
* [Docker workspace](https://hub.docker.com/u/seasketch) preloaded with open source geo tools for data preparation.
* Supports extended GeoJSON feature types called Sketches and SketchCollections suited to collaborative spatial planning
* Uses cloud-optimized techniques for storing and retrieving large datasets over a network including [Flatgeobuf](https://flatgeobuf.org/), [Cloud-optimized GeoTIFFs (COGs)](https://www.cogeo.org/), and [subdivision](https://github.com/seasketch/union-subdivided-polygons).
* Toolbox of geoprocessing functions utilizing [Turf JS](http://turfjs.org/), [Geoblaze](https://geoblaze.io/), [Simple Statistics](https://simplestatistics.org/).
* [Templates](#Templates) for common planning use cases that can be installed into your project.
* Cloud-native serverless architecture using [AWS Cloud Formation](https://aws.amazon.com/cloudformation/), with automated provisioning and migration as a project evolves.
* APIs for accessing project resources and integration including REST, Web Socket, and IFrame postMessage.

# 3rd Party Building Blocks

You will interact with a number of building blocks when creating a `geoprocessing` project, many of which are 3rd party software and services. The main building blocks include:

* [Github](https://github.com/seasketch/geoprocessing) - hosts the `geoprocessing` code repository.  It's also the recommended place to host your geoprocessing project.
* [NPM](https://www.npmjs.com/package/@seasketch/geoprocessing) - the Node Package Manager or NPM, hosts the `geoprocessing` Javascript package and allows it to be installed on your computer. It consists of an online repository for hosting Javascript packages, and a client library that is bundled with NodeJS on your local computer.
* [NodeJS](https://nodejs.org/en/) - an open source, cross-platform Javascript environment that allows Javascript code to be run on your computer.  The `geoprocessing` framework is written almost entirely in Typescript, which is converted to Javascript.  Every time you run a geoprocessing command, NodeJS is what is used behind the scenes to execute it.
* [Docker hub](https://hub.docker.com/repository/docker/seasketch) - Docker Hub is a container image registry.  Container images are lightweight, standalone, executable packages of software that include everything needed to be self-sufficient: code, runtime, system tools, system libraries and settings.  Docker Hub publishes the `geoprocessing` docker container images including `geoprocessing-workspace` and `geoprocessing-db`, which together provide a full suite of geospatial software needed by the geoprocessing framework, and that you can use for working with and publishing your geospatial data.
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) - software used to create and run instances of the `geoprocessing` container images on the users computer.  For Windows users, it also provides a way to install and run the geoprocessing framework within the Windows Subsystem for Linux (WSL).
* [VS Code](https://code.visualstudio.com/) - provides an integrated development environment (IDE) for managing a geoprocessing project including code editing, command-line terminal, Github integration, and more.
* [Amazon Web Service (AWS)](https://aws.amazon.com/what-is-aws/) - AWS is the cloud service provider that ultimately hosts your geoprocessing project and integrates with a SeaSketch project to run reports on demand.  It provisions the necessary storage, compute and database infrastructure automatically using [CDK](https://aws.amazon.com/cdk/).

# Known Limitations

## Javascript-only

* The current version of the library only supports spatial libraries written in Javascript.  This includes [Turf JS](http://turfjs.org/), [Geoblaze](https://geoblaze.io/), [cheap-ruler](https://github.com/mapbox/cheap-ruler) and anything else you can find.  There is discussion about supporting any analysis that can be packaged into a Docker container now that Lambda has [added container support](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/).  This will be done as need arises.

## WGS84

* Geoprocessing functions in this library currently only support GeoJSON data in the World Geodetic System 1984 (WGS 84) [WGS84] datum (aka Lat/Lon), with longitude and latitude units of decimal degrees.

## Calculation Error

Since the data is spherical (WGS84), most geoprocessing functions in this library (particularly [Turf.JS](http://turfjs.org/docs/#distance)) measure distance and area by approximating them on a sphere.  Algorithms are typically chosen that strike a balance between speed and accuracy.  So choose accordingly.  That said:

- If the geographic area of your project is small, on the order of a few hundred to a thousand miles, and not at high latitudes, then error is usually acceptable.
- Reporting the percentage of an area is not subject to the error of the algorithm for calculating the area.  For example, if you write a function to calculate the % of a particular habitat captured by a polygon that overlaps the habitat, as long as the area of the total habitat, and the area overlapping the habitat are calculated using the same formula, then the percentage of the two should be the same as if it were calculated using a more accurate area formula.

Sources:

* [Fast Geodesic Approximations](https://blog.mapbox.com/fast-geodesic-approximations-with-cheap-ruler-106f229ad016)
* [Calculate distance, bearing and more between Latitude/Longitude points](https://www.movable-type.co.uk/scripts/latlong.html)
* [Haversine Formula on Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula).  Used by [turf-distance](https://github.com/Turfjs/turf/tree/master/packages/turf-distance).  Error up to 0.5%
* [Some algorithms for polygons on a sphere](https://sgp1.digitaloceanspaces.com/proletarian-library/books/5cc63c78dc09ee09864293f66e2716e2.pdf) - used by [turf-area](http://turfjs.org/docs/#area).  Greater error at higher latitudes vs. Vincenty.
* [Vincenty algorithm](https://en.wikipedia.org/wiki/Vincenty%27s_formulae) used by [turf-vincenty-inverse](https://github.com/Turfjs/turf-vincenty-inverse)
* [GeoJSON spec WGS84 requirement](https://datatracker.ietf.org/doc/html/rfc7946#section-4).

# Known Issues

These are important to keep in mind when developing reports:

* If users cannot draw sketches on land, then Rasters must be clipped to land.  This is true for any place within the planning area that the user cannot draw.
* Holes should not be allowed in sketch polygons (such as via shapefile import), unless they are due to preprocessor clipping of non-eez areas like land.

The reason is because Geoblaze doesn’t handle holes in polygons.  When given a polygon for overlap, like geoblaze.sum(raster, polygon) if it finds value within the hole, it will include it in the result (think sum) when it should exclude it.
The right solution is to add support to geoblaze.  In the interim a hack was done in the overlapRaster toolbox function to remove any holes from the sketch GeoJSON just prior to running a geoblaze.sum or geoblaze.histogram.
So if you allow the sketch have holes that should exclude raster value, that will not happen!  The toolbox function will just remove the holes and happily include any raster value that is there.

* When working with VectorDatasources, requesting a union of subdivided eez polygons will occasionally throw a "looping" error - see [https://github.com/seasketch/geoprocessing/issues/72](https://github.com/seasketch/geoprocessing/issues/72) and [https://github.com/seasketch/union-subdivided-polygons/issues/5](https://github.com/seasketch/union-subdivided-polygons/issues/5).  It is not recommended to use unionProperty with the EEZ datasource, unless you thoroughly test with the country you are working with.  In practice this is not necessary anyway unless you are working with a complex EEZ boundary.
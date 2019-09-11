# data/dist/

Store all you output datasets if formats that are most efficient for processing, meaning that they are small, quick to load by the script, and quick to query. Here are some tools that may be useful.

  * [geobuf](https://github.com/mapbox/geobuf) > 10x file size reduction compared to geojson + faster parsing
  * [rbush](https://github.com/mourner/rbush) spatial indexes can be used to query by bounding box efficiently, and may be pre-built and serialized for faster loading.
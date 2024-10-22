# Subdividing Large Datasets

If you have very large polygon datasets (think country or global data) with very large complex polygon, the standard data import process which uses flatgeobuf, may not be sufficient. An alternative is to use a `VectorDataSource` specially created by SeaSketch. It's based on a method described by Paul Ramsey in [this article](https://blog.cleverelephant.ca/2019/11/subdivide.html) of [subdividing](https://postgis.net/docs/ST_Subdivide.html) your data, cutting it up along the boundaries of a spatial index.

Once the polygons have been subdivided, they can be put into small files encoded in the geobuf format, and a lookup table created for the index. This entire bundle can be then put into S3 cloud storage.

![subdivision process](https://user-images.githubusercontent.com/511063/79161015-a0375e80-7d8f-11ea-87a9-0658777f2f90.jpg)

The magic comes in being able to request polygons from this bundle in our geoprocessing functions. A `VectorDataSource` class is available that lets us request only the polygon chunks from our subdivided bundle that overlap with the bounding box of our sketch that we are currently analyzing. It even caches request results locally so that subsequent requests do not call out to the network if needed.

`VectorDataSource` can also rebuild the polygon chunks back into the original polygons they came from. Imagine you've subdivide a dataset of country boundary polygons for the entire world. You've subdivided them, and now you can reconstruct them back into country polygons. You simply need to maintain an attribute with your polygons that uniquely identifies how they should be reconstructed. This could be a `countryCode` or just a non-specific `gid`.

Here is an example of use end-to-end. Note this is quite a manual process. Future framework versions may try to automate it.

- [data prep script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-prep.sh).
- [sql subdivide script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union.sql) run by the data prep script
- [publish script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-publish.sh) brings the subdivided polygons out of postgis, encodes them in geobuf format, builds the index, and publishes it all to a standalone S3 bucket that is independent of your project. The url of the S3 bucket will be provided once complete. You can ``--dry-run` the command to see how many bundles it will create and how big they'll be. The sweet spot is bundles about ~25KB in size. Once you've found that sweet spot you can do the actual run.
- [use of VectorDataSource in gp function](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/src/functions/clipToOceanEez.ts#L32)

This is the method that is used for the global `land` and `eez` datasources. Here is a full example of subdividing OpenStreetMap land polygons for the entire world. This is what is used for the `clipToOceanEez` script that comes with the `ocean-eez` starter template.

- [publish vector data source](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-publish.sh)

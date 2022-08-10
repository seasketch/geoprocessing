# Geoprocessing

A serverless framework for publishing low-cost and low-maintenance `geoprocessing` services and reports in the cloud.  Part of the [SeaSketch](https://seasketch.org/) ecosystem.

## What is this for?

This frameworks niche is running spatial analysis, particularly overlay statistics, and generating real-time reports at scale, with different input, such as part of a collaborative spatial planning process.

Often, the original analysis might be prototyped in an environment like R, Jupyter Notebook, ArcGIS, QGIS, etc. and this framework can be used to "operationalize" the analysis at a cost, speed and scale that is hard to match with other products.

## Who is this for?

  This framework is specifically targeted to code-savvy folks that want to create and host geoprocessing projects themselves and plug them into their SeaSketch project, though it is not dependent on SeaSketch.  The SeaSketch team uses it for all projects, here are some [public ones](https://github.com/seasketch/geoprocessing/network/dependents?package_id=UGFja2FnZS0xMTc3OTQ1NDg5)

  The primary efficiency to this framework is that almost everything is written in Typescript/Javascript, both backend and frontend.  Third-party tools are accessible via Node bindings (AWS) or a standard shell environment using Docker (OGR, GDAL, PostGIS, Python).

[Geoprocessing Docs](https://github.com/seasketch/geoprocessing#readme)

## Versions

This project follows Semantic Versioning. The `latest` version is the most stable. `alpha` and `beta` versions are early canary releases for testing.  They are likely to have bugs and unfinished features.
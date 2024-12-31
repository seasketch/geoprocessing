---
slug: /
---

# Introduction

The SeaSketch Geoprocessing framework is an all-in-one solution for developing low-cost and low-maintenance geoprocessing functions and reports for the web, with Typescript. Simplified publish to cloud with auto-scaling to meet high demand.

This framework is part of the [SeaSketch](https://seasketch.org) ecosystem.

## Who is this framework for?

This framework is primarily designed for people that want to create and host their own geoprocessing functions and reports and plug them into their SeaSketch project, though it is not dependent on SeaSketch.

It is used for all SeaSketch [projects](https://github.com/seasketch/geoprocessing/network/dependents?package_id=UGFja2FnZS0xMTc3OTQ1NDg5).

## Goals

- [Serverless](https://aws.amazon.com/lambda/serverless-architectures-learn-more/) architecture that scales up to meet high demand, then scales down to near zero cost when not in use.
- First-class [Typescript](https://www.typescriptlang.org/) development experience.
- Provide a stable environment for writing analytical reports with React.
- Utilize cloud-optimized data formats including [Flatgeobuf](https://flatgeobuf.org/) and [Cloud-optimized GeoTIFF (COG)](https://www.cogeo.org/)
- Open source license

## License

Geoprocessing source code is licensed under a BSD 3-clause license and any reuse or modifications must retain this license with copyright notice.

Wiki docs, including any code snippets in tutorials, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

## Features

- Cloud-native serverless architecture
- Plug-and-play with SeaSketch platform
- End-to-end support and use of [Typescript](https://www.typescriptlang.org/)
- Project generator with templates and built-in commands for common project tasks
- Library of [React](https://reactjs.org/) UI components ready to add to reports.
- [Docker workspace](https://hub.docker.com/u/seasketch) preloaded with open source geo tools for data preparation.
- Supports extended GeoJSON feature types called Sketches and SketchCollections suited to collaborative spatial planning
- Uses cloud-optimized techniques for storing and retrieving large datasets over a network including [Flatgeobuf](https://flatgeobuf.org/), [Cloud-optimized GeoTIFFs (COGs)](https://www.cogeo.org/), and [subdivision](https://github.com/seasketch/union-subdivided-polygons).
- Toolbox of geoprocessing functions utilizing [Turf JS](http://turfjs.org/), [Geoblaze](https://geoblaze.io/), [Simple Statistics](https://simplestatistics.org/).
- Cloud-native serverless architecture using [AWS Cloud Formation](https://aws.amazon.com/cloudformation/), with automated provisioning and migration as a project evolves.
- APIs for accessing project resources and integration including REST, Web Socket, and IFrame postMessage.

## Skill Building

There are a number of required skills for using this framework successfully. If you don't have this knowledge, then skill building and potentially mentorship may be needed for you to succeed. Here is a list of resources that can help you get started:

- [Git and Github](https://www.youtube.com/watch?v=RGOj5yH7evk)
- [Node JS](https://www.freecodecamp.org/news/what-is-node-js/) development
- [VSCode](https://www.youtube.com/watch?v=WPqXP_kLzpo) integrated development environment (IDE)
- [Code debugging](https://www.freecodecamp.org/news/what-is-debugging-how-to-debug-code/)
- [Bash](https://www.freecodecamp.org/news/linux-command-line-bash-tutorial/) command line
- [React](https://www.freecodecamp.org/learn/front-end-development-libraries/#react) user interface development
- [Typescript](https://www.freecodecamp.org/news/programming-in-typescript/) code development
- [QGIS](https://www.qgis.org/en/site/) and [tutorials](https://www.qgistutorials.com/en/)
- [GDAL](https://gdal.org/index.html) and [tutorials](https://gdal.org/tutorials/index.html)

Essential tips For configuring this framework using a specific operating system (usually Ubuntu).

## 3rd Party Building Blocks

You will interact with a number of building blocks when creating a `geoprocessing` project, many of which are 3rd party software and services. The main building blocks include:

- [Github](https://github.com/seasketch/geoprocessing) - hosts the `geoprocessing` code repository. It's also the recommended place to host your geoprocessing project.
- [NPM](https://www.npmjs.com/package/@seasketch/geoprocessing) - the Node Package Manager or NPM, hosts the `geoprocessing` Javascript package and allows it to be installed on your computer. It consists of an online repository for hosting Javascript packages, and a client library that is bundled with NodeJS on your local computer.
- [NodeJS](https://nodejs.org/en/) - an open source, cross-platform Javascript environment that allows Javascript code to be run on your computer. The `geoprocessing` framework is written almost entirely in Typescript, which is converted to Javascript. Every time you run a geoprocessing command, NodeJS is what is used behind the scenes to execute it.
- [Docker hub](https://hub.docker.com/repository/docker/seasketch) - Docker Hub is a container image registry. Container images are lightweight, standalone, executable packages of software that include everything needed to be self-sufficient: code, runtime, system tools, system libraries and settings. Docker Hub publishes the `geoprocessing` docker container images including `geoprocessing-workspace` and `geoprocessing-db`, which together provide a full suite of geospatial software needed by the geoprocessing framework, and that you can use for working with and publishing your geospatial data.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - software used to create and run instances of the `geoprocessing` container images on the users computer. For Windows users, it also provides a way to install and run the geoprocessing framework within the Windows Subsystem for Linux (WSL).
- [VS Code](https://code.visualstudio.com/) - provides an integrated development environment (IDE) for managing a geoprocessing project including code editing, command-line terminal, Github integration, and more.
- [Amazon Web Service (AWS)](https://aws.amazon.com/what-is-aws/) - AWS is the cloud service provider that ultimately hosts your geoprocessing project and integrates with a SeaSketch project to run reports on demand. It provisions the necessary storage, compute and database infrastructure automatically using [CDK](https://aws.amazon.com/cdk/).

To learn more about , visit the [architecture](./architecture/Architecture.md) page.

# @seasketch/geoprocessing

[SeaSketch](https://seasketch.org) is a marine spatial planning tool focused on collaborative design. An important component of the SeaSketch design process is the continuous evaluation of user-designed zones (sketches) against science based criteria. These may take the forms of reports on habitats represented in the area, economic impacts of fisheries closures, or distance to significant landmarks like ports. This geoprocessing framework enables developers to create these reports and integrate them with SeaSketch using open-source tools.

## System components

Geoprocessing projects consist of [geoprocessing](./docs/geoprocessing.md) or [preprocessing](./docs/preprocessing.md) functions, client javascript components and data prep scripts. Functions are bundled into services that are deployed to [AWS Lambda](https://aws.amazon.com/lambda/). The advantage of running on lambda is that costs are based directly on use, and are typically very low compared to a server running 24/7. They also scale up to hundreds of simulateous users very quickly. Client code is stored on AWS S3 and distributed via CloudFront. SeaSketch runs these clients inside a sandboxed iframe to protect user data.

![Architecture overview](https://user-images.githubusercontent.com/511063/79143180-a1f22980-7d71-11ea-8624-6aacb73b94f3.png)

All the infrastructure pictured above is created for each geoprocessing project implementation. Resources are not shared in order to avoid issues of version mismatches and so that report authors can deploy to their own AWS account.

# Getting started

## Creating a new project

Each project may contain multiple data preparation routines, functions, and  report clients. For the most part it makes sense to create a new project for each SeaSketch project, however it may make sense at times to create projects that support a single cross-project function, such as the planned global-clipping service. 

`npx @seasketch/geoprocessing init` will download the framework and prompt for project metadata before initializing a new codebase. 

![init process screenshot](https://user-images.githubusercontent.com/511063/79147415-bd146780-7d78-11ea-8d81-0e4151ab8a2f.png)

## Configuring your editor


TODO: add .vscode dir to init script

The first version of @seasketch/geoprocessing support *only* Typescript and having an appropriately setup editor is crutial to taking advantage of this system. It is highly recommended you use [VSCode](https://code.visualstudio.com/). Projects are automatically initialized with settings in `.vscode`, and when prompted you should choose to *Install All* extensions for the best development experience.

## Populating the project with example inputs

Before working on any code your first step should be populating the project with example sketches. When added, your unit tests will automatically be run against these shapes and the client authoring environment will show them while working on ui outputs. These examples should be encoded as GeoJSON and can be downloaded from SeaSketch by using the *Export GeoJSON* context menu action.

```
  /examples/
    sketches/ # <-- examples used by geoprocessing functions
    features/ # <-- examples used by preprocessing functions
```

It's easy to generate these examples using SeaSketch, so be sure to make lots of examples that cover all edge cases. Will your function work with both Sketches and Sketch Collections? Then include both types. Maybe even include Sketches outside the project bounds to make sure error conditions are handled appropriately.

## Creating a geoprocessing function

Geoprocessing projects have a number of npm scripts available. Run `npm run create:function`, and choose "Geoprocessing" for the function type. After following the prompts a template function implementation and unit test file will appear under `src/functions`, as well as a new entry in `geoprocessing.json`. Run `npm test` to run these new unit tests against your examples and verify the initialization of the project if you'd like.

To implement the geoprocessing function, modify the template to incoporate new spatial operations or data. The framework expects your function to accept a Sketch or Sketch Collection (GeoJSON will certain required properties), and it can return any json-serializable object. It can be very helpful to implement a Typescript interface definition to help debug your function and aid the development of the report client ui, and the template includes such a definition to start with.

### Preparing data for geoprocessing

Implementing geoprocessing for vector data typically will involve data encoded as GeoJSON for use with libraries such as [turf](https://turfjs.org/) and [martinez-polygon-clipping](https://github.com/w8r/martinez). The efficiency of functions is largely determined by how these data are represented. Here are a few important points to keep in mind when preparing data:

  * Lambda functions are limited to 3gb of memory, max
  * Lambda "cold-starts" will start to slow with bundle sizes > 1-2 MB
  * A decimal precision of 6 digits in GeoJSON represents 10 cm of resolution (Anything higher is a waste, but by default most datasets are wasteful)
  * A large driver of size in many datasets is often the complex shoreline, which may be simplified without harm in some cases.

Projects start with a location under `data/` designed to facilitate workflows to turn raw data into efficient encodings for use with lambda functions. It includes a Dockerfile and docker-compose setup with a PostGIS database and OGR/GDAL tools that can run data prep tasks without dependence on the configuration of the author's desktop machine. More details on this setup can be found in the [data/README.md](https://github.com/seasketch/geoprocessing/blob/master/packages/geoprocessing/templates/project/data/README.md) file.

#### Packaging data with lambda vs serving over the network

For small datasets there's no need to complicate deployment. GeoJSON encodings of these data can be directly imported as a module and the framework will bundle these data into the lambda javascript code using webpack.

```ts
import ports from "../../data/dist/ports.json"; // 12kB
```

When building lambda functions the system will warn when the bundle size reaches 500kB and that threshold can be reached very quickly. Exceeding these guidelines means increasingly slower cold-starts. Cold starts occur when the AWS Lambda system starts a new Lambda instance rather than reusing one already in memory and ready to go. With even a 30mb file this can take longer than 10 seconds.

The solution for large datasets is to subdivide them into reasonably sized chunks stored in network storage (s3), create an spatial index of bundle locations, and then have Lambda functions load just the subset of the data they need for analysis in a particular region. The `geoprocessing bundle-features` command can be used to create such features. An example of this process can be [found here](https://github.com/mcclintock-lab/protected-seas/blob/master/data/prep-data.sh). Geoprocessing function handlers can then use these data services by creating a new `VectorDataSource`, as [shown here](https://github.com/mcclintock-lab/protected-seas/blob/master/src/functions/levelOfProtection.ts#L84). Instances of `VectorDataSource` can efficienctly fetch files for a bounding box and even cache them for use in requests for nearby regions.

![subdivision process](https://user-images.githubusercontent.com/511063/79161015-a0375e80-7d8f-11ea-87a9-0658777f2f90.jpg)

#### Deploying raster data for use in reports

Most raster datasets will require separate processing and uploading to s3 for use within geoprocessing functions. Rasters should be converted to cloud optimized geotiffs (COGs) that can be retrieved in an efficient manner from cloud storage. Converting a geotif to a COG can be done by using gdal libraries. An example of this process can be [found here](https://github.com/mcclintock-lab/bermuda-next-reports/blob/master/data/prep_bathymetry_raster_data.sh). (NOTE: the raster functionality uses the geoblaze.js library, which does not currently support COGs, so the full raster will be downloaded for processing. Running the COG conversion is still useful, though, for when COGs are fully supported in the code). 

### Running unit tests

When generating geoprocessing function templates using npm scripts, two test files will also be created (e.g. `functions/myFunctionSmoke.test.ts` and `functions/myFunctionUnit.test.ts` ). The smoke tests have 2 objectives: make sure your function exists and write out the results of the runs with the example sketches. The unit tests execute the functions and can be used to test correct output values. All unit tests can be run using `npm test`. This template by default will run your function against all sketches in `examples/sketches` and save the output to `examples/output`, which will be used when debugging the geoprocessing clients. 

Be default, each smoke test will be added to the @smoke group, and unit tests will be added to the @unit group. (Groups are specified in the docstring at the top of the file). To pass flags from npm to jest during tests, separate the npm test command from the jest flags using '--'. For example, to run just the smoke or unit test groups, you can send the --group flag to jest:

```bash
npm test -- --group=smoke #run only the smoke tests in a project
```

You can also run a target test by using the -t option, for example, running just a test called 'areaTest':
```bash
npm test -- -t=areaTest #run target test 'areaTest'
```

#### More resources

  * [Preprocessing functions (TODO:)]()

## Creating a geoprocessing client

Client report UI's are React components that run in iframes within SeaSketch. To generate a new report, run `npm run create:client`. This will create a template under `src/clients/` along with a simple unit test and entry in `geoprocessing.json`. 

The framework uses [Storybook](https://storybook.js.org/) to provide a environment to test your client using the results of your geoprocessing functions run on `examples/sketches`. To start, run `npm run storybook`. Be sure to run `npm test` to generate or update test outputs before using the storybook.

## Deployment

```bash
npm run build # first create lambda and client bundles
AWS_PROFILE=my-profile npm run deploy # deploy using aws credentials
```

After running deploy the service metadata endpoint will be shown. This can be referenced when linking to SeaSketch.

## Integration with SeaSketch

You will need the url shown after deploying the project, or need to retrieve it using `AWS_PROFILE=my-profile npm run url`. This url, along with the name of the report client, can be entered into the Sketch Class admin interface.

![sketch class admin screenshot](https://user-images.githubusercontent.com/511063/79162748-a7ac3700-7d92-11ea-9f30-2272fea15299.png)

# Contributing to the library

To contribute to @seasketch/geoprocessing please create a new branch for feature work and a pull request when ready to merge into master. Setting up your development environment as detailed below will make for a smoother process.

## Installation

This repository is setup as a "monorepo" managed by [Lerna](https://github.com/lerna/lerna), with two packages under `packages/`. These include the geoprocessing library itself and an example project that can be used to test functionality. To work on the library, checkout the repo and run lerna bootstrap.

```sh
mkdir @seasketch && cd @seasketch
git clone https://github.com/seasketch/geoprocessing.git
cd geoprocessing
npx lerna bootstrap
# bootstrap will install npm dependencies for both and prepare initial build
```

You should now be able to run unit tests for both packages
```sh
npx lerna run test
```

## Editor setup and style guidelines

You can use whatever code editor you want, however [VS Code](https://code.visualstudio.com/) provides some nice nice features for Typescript development and this project is configured to take advantage of them including autocompletion, built-in type docs, automatic code formatting on save, hide generated files, run build steps, etc.  To use them simply open the root folder of this repo in VS Code.  You should be prompted to install recommended workspace extensions on first load, but if you don't you can open the Extensions bar and `filter` for recommended.

![Install All extensions screenshot](https://user-images.githubusercontent.com/511063/79138662-be8a6380-7d69-11ea-96f4-20a759192434.png)

## Make code changes

Any changes you make to the Typescript code in `src` won't be reflected in the Javascript code in `dist` until you compile it.  You can do this a few different ways.  Watch modes are useful for active development, new changes will be compiled automatically as you go.

VS Code - Press Command+Shift+B to open the build menu
* `geoprocessing build` - build core library
* `geoprocessing build scripts` - build scripts only
* `geoprocessing watch` - build core library and watch for changes
* `geoprocessing watch scripts` - build scripts only and watch for changes

CLI - from packages/geoprocessing folder
* `npm run prepare` - build core library and scripts.  Also runs automatically on initial install and publish
* `npm run watch` - build core library and watch for changes
* `npm run watch:scripts` - build scripts only and watch for changes

## Debugging

When writing tests for your functions, you can use the VSCode debugger to set breakpoints and step through them.  Just add a breakpoint or a `debugger` call in one of your unit tests, then click the `Debug` menu in the left toolbar and select "Debug Tests".

## Storybook components

The framework has it's own storybook project that can be launched using `npm run storybook`. These components and their stories can be found under `packages/geoprocessing/components/`. As common ui patterns are developed the intention is to create a library of useful components with good documentation that report authors can use.

## Testing integration with project implementations

Testing modifications to the framework, particularly build steps, can be tricky
because of the varying environments under which the code may run. A good methodology is to first create unit tests and verify that they run, then modify `packages/example-project` and its unit tests and verify the tests run and `npm run build` steps work. It is not uncommon for these steps to pass and for bugs to still appear after publishing of the framework, so manual testing after publishing should be done as well.

To test with projects other than `example-project` on your local machine, npm link is a handy tool. From within `packages/geoprocessing` run the command `npm link`. This will make the library available to other packages locally (assuming the same version of node. watch out nvm users!). Then change to you project directory and run `npm link @seasketch/geoprocessing`. Any changes you make to the library will automatically be reflected in your geoprocessing implementation. Just watch out for a couple common problems:

  1. Make sure VSCode is running the two build processes, and they complete without errors. Implementations import code from `dist/`, not the source typescript files.
  2. Running npm install within your geoprocessing project can interact oddly with npm link and produce errors. If you suspect problems redo the linking process again after all your installs. You will need to run `npm unlink @seasketch/geoprocessing --no-save` in your project directory.  You can then try and relink.
  
  Further link troubleshooting steps:
  * If still issue you can fully unlink and relink the geoprocessing project as a global npm package. `npm unlink @seasketch/geoprocessing` in the geoprocessing package.  If you run `npm list -g --depth 0` and still see the geoprocessing package globally then also run `npm unlink -g @seasketch/geoprocessing`.  Now follow the complete steps again to relink.
  * If still issue, then consider also deleting your `node_modules` directory and `package-lock.json` file in your project directory to start fresh as they may have been put into an incosistent state by the linking.

## Publishing

To publish new versions of the framework run `lerna publish`. Please follow [semantic versioning conventions](https://semver.org/).

## Roadmap

  * v0.7 testing on simple vector reports with legacy version of SeaSketch
    * Replace recent geoprocessing functions and use for new projects
    * Build out component library as needed
    * Add [benchmarking and VectorDataSource stats](https://github.com/seasketch/geoprocessing/issues/10) tool
  * v0.9 Add support for [async execution model](https://github.com/seasketch/geoprocessing/issues/4) for longer running reports with progress bars
  * v0.9.1 Add [`requiresProperties` support](https://github.com/seasketch/geoprocessing/issues/2)
  * [Log access](https://github.com/seasketch/geoprocessing/issues/7)
  * v1.0 - [Authorization](https://github.com/seasketch/geoprocessing/issues/6) for protected datasets
  * v1.1 [Docker container-based geoprocessing](https://github.com/seasketch/geoprocessing/issues/8)
  * **v1.2** Open/encourage use by 3rd party developers

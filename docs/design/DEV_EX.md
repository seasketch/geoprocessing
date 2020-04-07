# Developer Experience

As simple as possible, but no simpler should be the goal. This framework needs to enable developers to 
create complex and interactive reports while also guiding them towards solutions that will ensure 
good performance and reduce errors.

## Getting started

```bash
$ npx seasketch-geoprocessing init

⌛ cloning template
⌛copying name and email from git config

What would you like to name your project?
BermudaReports

creating ./BermudaReports

Please write a description
MPA habitat and socio-economic impact reports for the Blue Prosperity Bermuda project.

Please provide a git repository where this project will be hosted:
https://github.com/seasketch/BermudaReports

Provide a homepage for your project [optional]

⌛ writing package config
⌛ installing dependencies

Your project configuration can be found in ./BermudaReports/project.yml

Next steps:
  * `npm run add_gp` to create a new geoprocessing service
  * `npm run add_preprocessing` to create a new preprocessing service
  * `npm run add_report` to create a new report client
  * `npm run add_tab` to create a new report client tab

Tips:
  * Create examples in SeaSketch, then export them as GeoJSON and save them in 
    ./examples for use in test cases and when designing reports
  * The ./data directory is where you can store scripts for generating data
    products for use in your geoprocessing. It's already setup with some useful
    Docker containers with data-prep software.

$ npm run add_gp
What would you like to call your geoprocessing service?
Habitats

Will this service use Docker containers [N/y]?
n

What execution model should this service run on?
1) Sync - Best for quick (< 2s) running reports
2) Async - Better for long-running processes

Would you like to use typescript [Y/n]?

⌛ creating service scaffolding
⌛ updating config

New geoprocessing service can be found under src/services/Habitats

```

User can then

  1) Populate `./examples` with test case sketches
  2) Store raw data in `./data` and use tools to build data products like indexed & subdivided `VectorDataSource`'s
  3) Write type definitions for expected geoprocessing output
  4) Implement geoprocessing function and test cases
  5) Create new report and report tabs that use the output data, interactively testing using Storybook
  6) Deploy to S3
  7) Integrate with their project on S3

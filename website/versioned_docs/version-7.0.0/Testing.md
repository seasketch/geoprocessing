---
slug: "/testing"
---

# Testing

```bash
npm run test
```

This will start a web server on port 8080 that serves up the `data/dist` folder. Smoke tests will run geoprocessing functions against all of the sketches and features in the `examples` folder. `projectClient.getDatasourceUrl` will automatically read data from localhost:8080 instead of the production S3 bucket url when using functions like `loadFgb()`, `geoblaze.parse()`.

### Smoke Tests

Smoke tests, in the context of a geoprocessing project, verify that your preprocessing and geoprocessing function are working, and produce an output, for a given input. It doesn't ensure that the output is correct, just that something is produced. The input in this case is a suite of features and sketches that you manage.

Smoke tests are your chance to convince yourself that functions are outputting the right results. This output is committed to the code repository as a source of truth, and if the results change in the future (due to a code change or an input data change or a dependency upgrade) then you will be able to clearly see the difference and convince yourself again that they are correct. All changes to smoke test output are for a reason and should not be skipped over.

### Unit Tests

Units tests go further than smoke tests, and verify that output or behavior is correct for a given input.

You should have unit tests at least for utility or helper methods that you write of any complexity, whether for geoprocessing functions (backend) or report clients (frontend).

- [Example](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/helpers/groupBy.test.ts)

You can also write unit tests for your UI components using [testing-library](https://testing-library.com/docs/react-testing-library/intro/).

- [Example](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesCard.test.tsx)

Each project you create includes a debug launcher which is useful for debugging your function. With the geoprocessing repo checked out and open in VSCode, just add a breakpoint or a `debugger` call in one of your tests or in one of your functions, click the `Debug` menu in the left toolbar (picture of a bug) and select the appropriate package. The debugger should break at the appropriate place.

## Generate Features and Sketches For Smoke Tests

In addition to using `genRandomFeatures`, you can create example features and sketches relevant to your project using GIS software, by drawing polygons using [geojson.io](https://geojson.io), or once you have your SeaSketch project setup, you can draw a sketch, right-click and export it as geojson, then copy it to the `examples/sketches` directory. These are all ways to build a comprehensive test suite.

## Run single unit or smoke test

To run only tests matching a specific name/description, you just need a portion of the test name/description to match on. For example for the following test:

`test("kelpPersist - tests run against all examples", async () => {`

You could run
`npm run test:matching 'kelpPersist - tests run against all examples'`

or simply

`npm run test:matching kelpPersist`

If is a smoke test or any test requiring access to the dev data server then in a separate shell you will need to first run `npm run start:data`.

## Testing API calls using Postman

A public collection of API calls for working with a report project is at

https://www.postman.com/seasketch/workspace/seasketch/collection/624822-1a2906ba-3360-428f-a09e-41dae1b8282e

Setup the collection variables to use it. Your `geometryUri` will need to come from SeaSketch. Try running a report from within SeaSketch and looking at the API call in the `Network` tab of your developer tools

## Testing API calls using API Gateway

After signing into the AWS Console:

- Search for and select `API Gateway`
- In the top right, select the AWS region your stack is deployed
- Find the REST API Gateway for your project and open it
- Click either `GET` or `POST` for any of the geoprocessing functions in the list
- Click the `Test` button with the lightning bolt
- Look at the Postman API calls for which query parameters (GET) or body JSON (POST) to enter.

An alternative way to find your API gateway is:

- From the AWS Console, search for and select `CloudFormation`
- In the top right, select the AWS region your stack is deployed
- Find the stack for your geoprocessing project
- Click the `Resources` tab
- Search for `AWS::ApiGateway::RestApi`
- Click the link to the gateway under `Physical ID`

## Debugging Tests

[ToDo]

- VSCode run and debug launch configurations

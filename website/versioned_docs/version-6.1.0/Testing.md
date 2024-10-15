---
slug: "/testing"
---

# Testing

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

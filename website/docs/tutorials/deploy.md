# Deploy your project

A `deploy` of your application uses [`aws-cdk`](https://aws.amazon.com/cdk/) to inspect your local build and automatically provision all of the necessary AWS resources as a single [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) stack.

This includes:

- S3 storage buckets for publishing datasources and containing bundled Report UI components
- Lambda functions that run preprocessing and geoprocessing functions on-demand
- A Gateway with REST API and Web Socket API for clients like SeaSketch to discover, access, and run all project resources over the Internet.
- A DynamoDB database for caching function results

For every deploy after the first, it is smart enough to compute the changeset between your local build and the published stack and modify the stack automatically.

## Setup AWS

You are not required to complete this step until you want to deploy your project and integrate it with SeaSketch. Until then, you can do everything except `publish` data or `deploy` your project.

You will need to create an AWS account with an admin user, allowing the framework to deploy your project using CloudFormation. A payment method such as a credit card will be required.

Expected cost: [free](https://aws.amazon.com/free) to a few dollars per month. You will be able to track this.

- Create an Amazon [AWS account] such that you can login and access the main AWS Console page (https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
- Create an AWS IAM [admin account](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html). This is what you will use to manage projects.

## AWSCLI

If you are using a Docker devcontaine to develop reports you should already have access to the `aws` command. But if you are running directly on your host operating system you will need to install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) it with your IAM account credentials.

### Extra steps for Windows

Windows you have the option of installing [awscli for Windows](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and then exposing your credentials in your Ubuntu container. This allows you to manage one set of credentials.

Assuming your username is `alex`, once you've installed awscli in Windows, confirm you now have the following files under Windows.

```bash
C:\Users\alex\.aws\credentials
C:\Users\alex\.aws\config
```

Now, open a Ubuntu shell and edit your bash environment variables to [point to those files](https://stackoverflow.com/questions/52238512/how-to-access-aws-config-file-from-wsl-windows-subsystem-for-linux/53083079#53083079).

Add the following to your startup `.bashrc` file.

```bash
export AWS_SHARED_CREDENTIALS_FILE=/mnt/c/Users/alex/.aws/credentials
export AWS_CONFIG_FILE=/mnt/c/Users/alex/.aws/config
```

[How do I do that?](../skills.md#editing-your-startup-bash-script-in-ubuntu)

Now, verify the environment variables are set

```bash
source ~/.bashrc
echo $AWS_SHARED_CREDENTIALS_FILE
echo $AWS_CONFIG_FILE
```

## Confirm awscli is working

To check if awscli is configured run the following:

```bash
aws configure list
```

If no values are listed, then the AWS CLI is not configured properly. Go back and check everything over for this step.

## Do the deploy

To deploy your project run the following:

```bash
npm run deploy
```

When the command completes, the stack should now be deployed. It should print out a list of URL's for accessing stack resources. You do not need to write these down. You can run the `npm run url` command at any time and it will output the RestApiUrl, which is the main URL you care about for integration with SeaSketch. After deploy a `cdk-outputs.json` file will also have been generated in the top-level directory of your project with the full list of URL's. This file is not checked into the code repository.

Example:

```json
{
  "gp-fsm-reports-test": {
    "clientDistributionUrl": "abcdefg.cloudfront.net",
    "clientBucketUrl": "https://s3.us-west-2.amazonaws.com/gp-fsm-reports-test-client",
    "datasetBucketUrl": "https://s3.us-west-2.amazonaws.com/gp-fsm-reports-test-datasets",
    "GpRestApiEndpointBF901973": "https://tuvwxyz.execute-api.us-west-2.amazonaws.com/prod/",
    "restApiUrl": "https://tuvwxyz.execute-api.us-west-2.amazonaws.com/prod/",
    "socketApiUrl": "wss://lmnop.execute-api.us-west-2.amazonaws.com"
  }
}
```

### Debugging deploy

- If your AWS credentials are not setup and linked properly, you will get an error here. Go back and [fix it](#setup-aws).
- The very first time you deploy any project to a given AWS data center (e.g. us-west-1), it may ask you to bootstrap cdk first. Simply run the following:

```bash
npm run bootstrap
```

Then `deploy` again.

- If your deploy fails and it's not the first time you deployed, it may tell you it has performed a `Rollback` on the deployed stack to its previous state. This may or may not be successful. You'll want to verify that your project is still working properly within SeaSketch. If it's not you can always destroy your stack by running:

```bash
npm run destroy
```

Once complete, you will need to `build` and `deploy` again.

## Publish your datasources

Once you have deployed your project to AWS, it will have an S3 bucket for publishing `datasources` to.

Your datasources will need to have already been imported using `import:data` and exist in data/dist for this to work.

```bash
npm run publish:data
```

It will ask you if you want to publish all datasources, or choose from a list.

- Note if you don't publish your datasources, then your smoke tests may work properly, but your geoprocessing functions will throw file not found errors in production.

## Creating SeaSketch Project and Exporting Test Sketches

Using `genRandomSketch` and `genRandomFeature` is a quick way to get started with sample sketches that let's you run your smoke tests for your geoprocessing function and view them in a storybook. Once you do that, you can move on to creating example sketches for very specific locations within your planning area with exactly the sketch properties you want to test. This is most easily done using SeaSketch directly.

First, follow the [instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/getting-started) to create a new SeaSketch project. This includes defining the planning bounds and [creating a Sketch class](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes). You will want to create a `Polygon` sketch class with a name that makes sense for you project (e.g. MPA for Marine Protected Area) and then also a `Collection` sketch class to group instances of your polygon sketch class into. Note that sketch classes are where you will integrate your geoprocessing services to view reports, but you will not do it at this time.

One you've created your sketch classes, follow the instructions for [sketching tools](https://docs.seasketch.org/seasketch-documentation/users-guide/sketching-tools) to draw one or more of your polygon sketches. You can also create one or more collections and group your sketches into them.

Finally, [export](https://docs.seasketch.org/seasketch-documentation/users-guide/sketching-tools#downloading-sketches) your sketches and sketch collections as GeoJSON, and move them into your geoprocessing projects `examples/sketches` folder.

```bash
  /examples/
    sketches/ # <-- examples used by geoprocessing functions
    features/ # <-- examples used by preprocessing functions
```

Once you add your example sketches and collections to this folder, you can `npm run test` and any smoke tests will automatically include these new examples and generate output for them for each geoprocessing function. You can then look at the smoke test output and ensure that it is as expected.

It's now possible for you to quickly create examples that cover common as well as specific use cases. For example are you sure your geoprocessing function works with both Sketches and Sketch Collections? Then include examples of both types. Maybe even include Sketches that overlap outside the planning area to make sure error conditions are handled appropriately. Or create a giant sketch that covers the entire planning area to make sure your reports are picking up all of the data and % overlap metrics are 100% or very close. Does your geoprocessing project handle overlapping sketches within a collection properly? Create all kinds of overlap scenarios.

## Integrating Your Project with SeaSketch

Once you've deployed your project, you will find a file called `cdk.outputs` which contains the URL to the service manifest for your project.

```json
"restApiUrl": "https://xxxyyyyzzz.execute-api.us-west-2.amazonaws.com/prod/",
```

Now follow the [SeaSketch instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes) to assign services to each of your sketch classes.

If your sketch class is a Polygon or other feature type, you should assign it both a preprocessing function (for clipping) and a report client. If you installed the `template-ocean-eez` starter template then your preprocessor is called `clipToOceanEez` and report client is named `MpaTabReport`.

If your sketch class is a collection then you only need to assign it a report client. Since we build report clients that work on both individual sketches and sketch collections, you can assign the same report client to your collection as you assigned to your individual sketch class(es).

This should give you the sense that you can create different report clients for different sketch classes within the same project. Or even make reports for sketch collections completely different from reports for individual sketches.

Create a sketch and run your reports to make sure it all works!

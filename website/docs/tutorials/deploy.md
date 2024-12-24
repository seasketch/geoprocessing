# Deploy your project

A `deploy` of your application uses [`aws-cdk`](https://aws.amazon.com/cdk/) to inspect your local build and automatically provision all of the necessary AWS resources as a single [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) stack.

This includes:

- S3 storage buckets for publishing datasources and containing bundled Report UI components
- Lambda functions that run preprocessing and geoprocessing functions on-demand
- A Gateway with REST API and Web Socket API for clients like SeaSketch to discover, access, and run all project resources over the Internet.
- A DynamoDB database for caching function results

For every deploy after the first, it is smart enough to compute the changeset between your local build and the published stack and modify the stack automatically.

## Setup AWS

You are not required to complete this step until you want to deploy your project and integrate it with SeaSketch. Until then, you can do everything **except** `publish` data or `deploy` your project.

You will need to create an AWS account with an admin user, allowing the framework to deploy your project using CloudFormation. A payment method such as a credit card will be required.

Expected cost: [free](https://aws.amazon.com/free) to a few dollars per month. You will be able to track this.

### AWS Account and User

If you are on the SeaSketch team, an AWS account and user will be provided to you.

- Create an Amazon [AWS account] such that you can login and access the main AWS Console page (https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
- Create an AWS IAM [admin account](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html). This is what you will use to manage projects.
- Setup IAM role allowing API Gateway to log info to Cloudwatch
  - By default, API Gateway does not have the required permission to write logs to CloudWatch. It is necessary to specify an IAM Role. This can be accomplished by logging into the AWS console, switching to the region where you would like to deploy your geoprocessing function, and configuring this role.
  - https://coady.tech/aws-cloudwatch-logs-arn/

### Install AWSCLI

If you are using a Docker devcontainer to develop reports you should already have access to the `aws` command.

But if you are developing reports directly on your host operating system you will need to install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) it with your IAM account credentials.

### AWSCLI Credentials - Virtual

If you are using a [virtual install](./Tutorials.md#virtual-install-with-docker-desktop) setup, it would have instructed you to create a `.env` file from the provided `.env.template` file. This is were you need to configure two environment variables with your AWS admin account credentials. When you start your devcontainer the variables will be loaded into your shell environment and picked up by all aws commands. The benefit of loading the variables this way is that they will persist and you won't have to set them every time.

```
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_ACCESS_KEY
```

### AWSCLI Credentials - Windows

When running on Windows you have two options for providing your AWS credentials

1. configure credentials in Linux.
2. load credentials from Windows

#### Configure Credentials in WSL Linux

Set environment variables in the `.bashrc` file in your Linux home directory.

```bash
nano ~/.bashrc
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_ACCESS_KEY

Ctrl-o to save
Ctrl-x to exit
```

Now, source the file into your current shell environment and verify the environment variables are set

```bash
source ~/.bashrc
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

#### Load Credentials From Windows

you have the option of installing [awscli for Windows](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and then exposing your credentials in your WSL Linux environment. This allows you to manage one set of credentials for Windows and all Linux distros.

Assuming your username is `alex`, once you've installed awscli in Windows, confirm you now have the following files under Windows.

```bash
C:\Users\alex\.aws\credentials
C:\Users\alex\.aws\config
```

Now, open a Ubuntu shell and edit your bash environment variables to [point to those files](https://stackoverflow.com/questions/52238512/how-to-access-aws-config-file-from-wsl-windows-subsystem-for-linux/53083079#53083079).

Add the following to your startup `.bashrc` file.

```bash
nano ~/.bashrc
export AWS_SHARED_CREDENTIALS_FILE=/mnt/c/Users/alex/.aws/credentials
export AWS_CONFIG_FILE=/mnt/c/Users/alex/.aws/config

Ctrl-o to save
Ctrl-x to exit
```

Now, source the file into your current shell environment and verify the environment variables are set

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

# Setup an exising geoprocessing project

This use case is where a geoprocessing project already exists, but it was developed on a different computer.

First, clone your existing geoprocessing project to your work environment, whether this is in your local docker devcontainer, Windows WSL, or bare metal on your operating system.

## Link your source data

1. figure out [which option](#link-project-data) was used to bring data into your geoprocessing project, and follow the steps to set it up.

- Option 1, you're good to go, the data should already be in `data/src` and src paths in `project/datasources.json` should have relative paths pointing into it.
- Option 2, Look at `project/datasources.json` for the existing datasource paths and if your data file paths and operating system match you may be good to go. Try re-importing your data as below, and if it fails consider migrating to Option 1 or 3.
- Option 3, if you're running a devcontainer you'll need to have made your data available in workspace by mounting it from the host operating system via docker-compose.yml (see installation tutorial) or have somehow synced or downloaded it directly to your container. Either way, you then just need to symlink the `data/src` directory in your project to your data. Make sure you point it to the right level of your data folder. Check the src paths in `project/datasources.json`. If for example the source paths start with `data/src/Data_Received/...` and your data directory is at `/Users/alex/Library/CloudStorage/Box-Box/ProjectX/Data_Received`, you want to create your symlink as such

```bash
ln -s /Users/alex/Library/CloudStorage/Box-Box/ProjectX data/src
```

Assuming `data/src` is now populated, you need to ensure everything is in order.

2.Reimport your data

This will re-import, transform, and export your data to `data/dist`, which is probably currently empty.

```bash
npm run reimport:data
```

Say yes to reimporting all datasources, and no to publishing them (we'll get to that).

If you see error, look at what they say. If they say datasources are not being found at their path, then something is wrong with your drive sync (files might be missing), or with your symlink if you used option 3.

If all is well, you should see no error, and `data/dist` should be populated with files. In the Version Control panel your datasources.json file will have changes, including some updated timestamps.

But what if git changes show a lot of red and green?

- You should look closer at what's happening. If parts of the smoke test output (examples directory JSON files) are being re-ordered, that may just be because Javascript is being a little bit different in how it generates JSON files from another computer that previously ran the tests.
- If you are seeing changes to your precalc values in precalc.json, then your datasources may be different from the last person that ran it. You will want to make sure you aren't using an outdated older version. If you are using an updated more recent version, then convince yourself the changes are what you expect, for example total area increases or decreases.

What if you just can't your data synced properly, and you just need to move forward?

- If the project was deployed to AWS, then there will be a copy of the published data in the `datasets` bucket in AWS S3.
- To copy this data from AWS back to your `data/dist` directory use the following, assuming your git repo is named `fsm-reports-test`
  - `aws s3 sync s3://gp-fsm-reports-test-datasets data/dist`

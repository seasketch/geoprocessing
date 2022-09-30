# Data Prep Workspace

Here you will find a place to store source data and scripts to produce derived
products that will be used in geoprocessing functions.  Standard procedure is to copy or use a symbolic link to bring your data files into `data/src`.  The benefit of this is you can use relative paths to point import scripts at your data.  See the Getting Started docs for more information on setting up your data folder, and using the `data` scripts.

## Docker workspace

A docker environment is available that provides access to a variety of GIS tools ready to go.  This can be used for doing custom data transformations for example with src data.

To use this container, run the following in the command line from the `data/` folder
```
docker-compose run --rm workspace
```

This will start the workspace container and open a shell in that environment.
It will also start a PostgreSQL database container. You can access this database using the `psql` command (no args) within the workspace, or from the host computer on port 54320 using the credentials found in `data/docker-compose.yml`. A great workflow is to use the up-to-date psql client and ogr/gdal libraries in the workspace to import and run scripted data prep tasks while using QGIS on the host computer to visualize spatial data in postgres. Files in your project will be mirrored to the workspace.

Note that when running docker-compose as shown above, the workspace container state will be deleted once you log out of the shell, while the database will be saved in a persistant volume.


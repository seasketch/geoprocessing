# Data Prep Workspace

Here you will find a place to store source data and scripts to produce derived
products that will be used in geoprocessing functions. The docker-compose.yml
file contains two useful containers for working on data. 

To use these containers, run the following in the command line from `data/`

`docker-compose run --rm workspace`

This will start the workspace container open a shell in that environment.
It will also start a PostgreSQL database container. You can access this database using the `psql` command (no args) within the workspace, or from the host computer on port 54320 using the credentials found in `data/docker-compose.yml`. A great workflow is to use the up-to-date psql client and ogr/gdal libraries in the workspace to import and run scripted data prep tasks while using QGIS on the host computer to visualize spatial data in postgres. Files in your project will be mirrored to the workspace.

Note that when running docker-compose as shown above, the workspace container state will be deleted once you log out of the shell, while the database will be saved in a persistant volume.


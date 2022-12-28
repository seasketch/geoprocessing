# Data bin directory

This folder contains scripts used by the `seasketch/geoprocessing-workspace` docker container.

Code is installed (copied) directly to the geoprocessing project on init under `data/bin` allowing the developer to inspect and even modify it.  The `data/bin` folder is then mounted as a volume in the `geoprocessing-workspace` container at run time, or when running `npm run workspace`.  When the geoprocessing library is upgraded to a new version, it is up to the developer to inspect the CHANGELOG and merge the latest scripts from 

This code "scaffolding" approach putallows the user to inspect and even modify the scripts to suit their needs, rather than hiding them within the geoprocessing library or pre-installing them to the container.
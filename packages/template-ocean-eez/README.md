# gp-clip-ocean

Preprocessor to clip features to within an ocean boundary.  By default it's setup to erase parts of the feature overlapping land and outside the EEZ boundary (200 nautical miles).

## Getting Started

Follow the [`geoprocessing` docs](../../README.md#templates) for adding a template to your project and adapting it.  This directory is not usable on its own.

## Datasources

* `eez_union_land` (version 3, based on EEZ version 11).  This is the union of world country boundaries and Exclusive Economic Zones (EEZs) which are 200 nautical miles .  This allows a polygon be clipped to the outer EEZ boundary without using the Marine Regions interpretation of the shoreline which can be very coarse - https://marineregions.org/downloads.php

* `osm_land` (latest snapshot at time of download).  Derived from OpenStreetMap ways tagged with natural=coastline.  Uses the OSMCoastline program to assembline a single contigous polygon dataset.

This template can be customized for your needs.  Common customizations include:
* Further filtering the global datasets to a specific region to reduce the amoount of data to maintain.  Data prep scripts can be amended to do this additional filtering.
* Adding more accurate or authoritative datasets required by a planning body.  These can be added using the global datasets as a guide.
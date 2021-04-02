# gp-clip Template

Template for clipping sketches to marine and shoreline boundaries.  Provides scripts for fetching, preparing, and publishing common global datasets and a preprocessing function for clipping sketches.

Default datasets include:
* `Marine and land zones` (version 3, based on EEZ version 11).  This is the union of world country boundaries and Exclusive Economic Zones (EEZs) which are 200 nautical miles .  This allows a marine sketch to be clipped to the outer EEZ boundary without using the Marine Regions interpretation of the shoreline which can be very coarse - https://marineregions.org/downloads.php
* `OpenStreetMap land polygons` (latest snapshot at time of download).  Derived from OpenStreetMap ways tagged with natural=coastline.  Uses the OSMCoastline program to assembline a single contigous polygon dataset.

This template can be customized for your needs.  Common customizations include:
* Further filtering the global datasets to a specific region to reduce the amoount of data to maintain.  Data prep scripts can be amended to do this additional filtering.
* Adding more accurate or authoritative datasets required by a planning body.  These can be added using the global datasets as a guide.


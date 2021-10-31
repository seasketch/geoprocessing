#!/bin/bash
# Run in workspace

gdal_translate -r nearest -a_nodata 0 -of COG -stats quad_10.tif quad_10_cog.tif

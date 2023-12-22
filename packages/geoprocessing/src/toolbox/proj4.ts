import proj4 from "proj4";

// Add equal area projection - https://epsg.io/6933
proj4.defs(
  "EPSG:6933",
  "+proj=cea +lat_ts=30 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs"
);

export default proj4;

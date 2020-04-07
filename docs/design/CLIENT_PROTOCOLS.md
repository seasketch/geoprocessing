# Client Protocols and Sandboxing

Report client and geoprocessing code must be isolated from the SeaSketch runtime environment to prevent 
leakage of sensitive data and user credentials to 3rd-party code. For this reason these javascript 
components will be run within <iframe /> elements and communicate with SeaSketch only through safe channels.

![client communication protocol diagram](https://user-images.githubusercontent.com/511063/73032762-d1d60480-3df4-11ea-9cf5-4817a0b19e4b.png)


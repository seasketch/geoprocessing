# Job status tracking and error handling

Updating the geoprocessing task `status` to indicate a *pending*, *failed*, or *completed* state helps drive appropriate client display and is needed to report outages.

## previous system

The prototype seasketch-sls-geoprocessing project managed status updates by looking for indicators in logs. The rationale for this approach was that logs were being pushed into sqs anyways, and exceptions were difficult to handle prior to lambda supporting async/await. 

## new system arch

Catching exceptions is easier with v10 so it should be possible to catch them in the lambda and report them via dynamodb. Failures of the surrounding handler should be very rare to non-existent, but some facility to catch them via timeouts should be considered. 

### docker errors

How do?
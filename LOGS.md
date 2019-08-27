# Logging

Logging is a thorny problem in this space and frankly it's appaling that AWS
doesn't provide better tools. For this system to work, logs from potentially
multiple lambda processes and Fargate containers need to be correlated. Because
this situation and the buzzwords around potential solutions are so confusing I'm
going to be recording my thoughts here.

## Filtering logs for a single request

### X-Ray

This service is bandied about as a solution for debugging multiple event sources
and microservices around a single request. It does not *seem* to handle logs
however. I may need to more deeply research this and maybe even make a demo app
to understand it.

### Storing correlation ids

One solution would be to store IDs for each service in a list on the
GeoprocessingTask record so that Cloudwatch logs can be filtered using them
later. It would be better to have a single ID but if that's not possible... it's
just not possible.

## Logging from Docker/Fargate containers

how do?

## How it's done in prototype seasketch-sls-geoprocessing

All cloudwatch messages for all geoprocessing scripts are routed to the same sqs channel and interpretted by the central analysis server. It keeps records of requestIds and forwards them to an internal database. In a way it is using the *store correlation ids* approach, but it relies in certain cases on discovering new correlation ids by identifying new ones in the same message as a known requestID. 

This requires a lot of processing, but makes fetching logs out of the db cheap and enables pushing them to the client. The amount of effort and compute resources needed to support this is out of touch with how useful log push is though. In the next version logs should just be polled. They aren't used for much other than debugging.

## Log Retention

By default logs should be purged after a reasonable interval, say 30 days. If
it's easy it would nice to have a user setting but it's not a high priority.
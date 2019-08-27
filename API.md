# API

> This documentation pertains to the internals of the http request api. Users of
> the framework shouldn't need to concern themselves with these details

*seasketch-sls-geoprocessing* should support many report implementations over a
long period of time. This will require a solid API design for running tasks that
can evolve through versioning and support different client implementations. This
system is to be decoupled from the main SeaSketch infrastructure and support 3rd
party developers. Key challenges that the design needs to address include:

  * Serving results to clients with low latency
  * Getting potentially very large geometries to geoprocessing scripts in an
    efficient and secure manner
  * Securing access to geoprocessing scripts and data themselves
  * Supporting both quick-running reports and long-running analyses than may run
    for hours
  * Includes client-side javascript implementation of the reports api

## Project structure

Geoprocessing services are deployed as part of a **Project**. A **Project**
contains one or more services and reporting client implementations. This enables
authors to include multiple implementations within the same source repo in
support of a single SeaSketch site.


## Geoprocessing project metadata

The root service endpoint contains details about all service and javascript
clients in the project. This info can be exposed in the admin interface of a
SeaSketch project, and used to inform clients how to interact with services. It
is updated each time the project is published.

```GET /```

```typescript

// response
interface GeoprocessingProject {
  serviceUri: string;
  sourceUri?: string; // github repo or similar
  published: string; //  ISO 8601 date
  apiVersion: string; // semver
  services: Array<GeoprocessingService>;
  clients: Array<ReportClient>;
}

interface GeoprocessingService {
  id: string;
  endpoint: string;
  executionMode: ExecutionMode;
  usesAttributes: Array<string>;
  medianDuration: number; //ms
  medianCost: number; //usd
  rateLimited: boolean;
  rateLimitPeriod: RateLimitPeriod;
  rateLimit: number;
  rateLimitConsumed: number;
  restrictedAccess: boolean;
}

interface ReportClient {
  id: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
}

type ExecutionMode = "async" | "sync";
type RateLimitPeriod = "monthly" | "daily";

```

## Geoprocessing service requests

Making a geoprocessing request involves POST-ing a json document to the service
endpoint in the following format:

```typescript
interface GeoprocessingRequest {
  geometry?: SeaSketchFeature | SeaSketchFeatureCollection;
  geometryUri?: string; // must be https
  token?: string; // jwt token that can be verified using .well-known/jwks.json
  cacheKey?: string;
}
```

#### geometry & geometryUri

Geometries must be provided as GeoJSON to the service, but there is some
flexibility in how it's provided. For testing clients and cases where the
geometry is very simple, embedding GeoJSON in the request body is sufficient. In
many cases it will be necessary to use `geometryUri` as an alternative. Some
FeatureSets may be too big to stuff into a request body, and often clients just
don't have the full GeoJSON to send if they are rendering simplified or tiled
representations of the geometry.

When fetching the geometry via network the geometry must be accessible solely
using the value of geometryUri. There are many ways to secure user data, such as
using an long and opaque unique url, embedding a
[jwt](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) in the
request parameters (which could utilize `exp`), and/or whitelisting the
geoprocessing service host. These details are left for the clients to implement.

While passing GeoJSON to the service is fine, the system accepts a format that
could be considered a superset of GeoJSON. FeatureCollections may (and should)
contain a *properties* member, and a FeatureCollection may include nested 
FeatureCollections as members of the *features* array.

#### access control tokens

Certain reports may be restricted because they contain sensitive data or are
just to costly to run for unauthorized users. Project authors can in these cases
set the service to have `restrictedAccess` as seen in the metadata endpoint.
Clients in this case must provide a [JSON Web
Token](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) in
each request. This token must be verifiable using the issuer's [JSON Web Key
Set](https://tools.ietf.org/html/rfc7517) endpoint and the service will respect
the token's expiration field. By default the framework only respects seasketch.org
as an issuer, but authors may provide other hosts to include in the whitelist.
The jwt payload should be a JSON object matching the following format:

```json
  {
    "allowedGeoprocessingHosts": ["1234abcd.execute-api.us-west-2.amazonaws.com", "..."]
  }
```

Restricted services which do not find themselves in the allowed hosts will
respond with a 403 error.

### caching

Responding to requests as quickly as possible means first and foremost avoiding
extra work. Clients are ultimately responsible for providing a cache key with 
their request. This will be combined with either a hash of the geojson provided 
or the geometryUri to avoid security issues with users requesting access to results
that don't belong to them. Clients can create these cache keys using varying 
complexities of approaches.

  1. The easiest, don't provide a key
  2. Use the sketches updatedAt date and provide it as a string
  3. Use the `usesAttributes` service metadata to determine what attributes are utilized 
     by the service, and create an appropriate hash e.g. 
     hash(geometryLastUpdatedAt + propA + propB)

Note that the server will hash the cacheKey and geometryUri together, meaning copied
sketches with different id's will not get a cache hit when requesting results. To 
address this there will have to be a `copyResults` API endpoint that creates these
result copies. **On second thought, is that really necessary? Can we rather just exclude 
sensitive information from the geometryUri?**


### Responses

All services respond with the following JSON but will need to be interpreted
differently by clients depending on the executionMode.

```typescript
interface GeoprocessingTask {
  location: string;
  startedAt: string; //ISO 8601
  duration?: string; //ms
  logUriTemplate: string;
  geometryUri: string;
  status: GeoprocessingTaskStatus;
  wss?: string; // websocket for listening to status updates
  data?: object; // result data can take any json-serializable form
}

type GeoprocessingTaskStatus = "pending" | "completed" | "failed";
```

For **sync** services the initial request will respond with a GeoprocessingTask
object with a status of "completed" or "failed". These are very simple to
interpret. Asynchronous responses are more complex. They will very likely return
in a "pending" state and the client will need to either poll `location` (not
recommended) or subscribe to the websocket connection `wss`. 

#### Websockets

Using the `wss` endpoint for async tasks can be accomplished with the native
[WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). 
The event data sent to clients will be the same GeoprocessingTask object, but
with updates to status and result data. Once `status` has changed to "completed"
or "failed" the connection will be closed by the server. Upon connection to
socket, if the task is already complete the server will send the completed
GeoprocessingTask event and close the connection immediately. This way there
should be no race condition when attempting to retrieve results.

#### Providing user feedback in clients

While waiting for a geoprocessing task to complete there is information that can
be used to provide progress indicators and log messages. The
GeoprocessingService metadata object contains a medianDuration in ms. By keeping
track of the start time clients can show a progress indicator based on this ETA.
For async services the `logUriTemplate` can be used to display logs before the
results are complete. `location` can be linked in the UI to take users to a page
that includes lots of useful debugging information about a geoprocessing task
run.

#### Accessing Logs

`logUriTemplate` can be resolved to retrieve log messages. It is limited to 100
messages by default but can be specified using the *limit* query param. The
*nextToken* param can also be used to specify an offset if a limit is reached
and returned in the previous results. 
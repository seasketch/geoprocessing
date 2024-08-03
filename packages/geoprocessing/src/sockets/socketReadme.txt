- Connect to socket at wss url

- Send it a message
- In your WebSocket API, incoming JSON messages are directed to backend integrations based on routes that you configure.
- connect/disconnect/sendmessage
- A route includes a route key, which is the value that is expected once a route selection expression is evaluated. The routeSelectionExpression is an attribute defined at the API level. It specifies a JSON property that is expected to be present in the message payload.
- routeSelectionExpression: "$request.body.message"
- API Gateway calls the $connect route when a persistent connection between the client and a WebSocket API is being initiated.
- API Gateway calls the $disconnect route when the client or the server disconnects from the API.


connect - creates record in subscriptions table
disconnect
sendmessage
  - scans subscription table for service/connection ID/cache key
  - post table data to socket using connectionId

useFunction
  - called by ResultsCard
  - calls runTask(lambda url)
    - calls lambda function, which calls GeoprocessingHandler start
    - if async GeoprocessingHandler/runTask returns pending task object with wss base url
  - while pending, createSocket() with url
    - wssUrl = task.wss +
        "?" +
        "serviceName=" +
        sname +
        "&cacheKey=" +
        ck +
        "&fromClient=true"
  - when socket opens, it calls "connect" route on the backend
  - socket onmessage - receive result event and complete task

GeoprocessingHandler (run)
  - if async start, crafts wss url and puts into task object
    let wss =
      "wss://" +
      encodeURIComponent(WSS_REF) +
      ".execute-api." +
      encodeURIComponent(WSS_REGION) +
      ".amazonaws.com/" +
      encodeURIComponent(WSS_STAGE);
  - fetches geojson, invokes gp function, calls Tasks.complete with results
  - calls sendSocketMessage, which opens a socket connection given wssUrl
  - calls sendmessage route with socket url, task ID, and task service
    let message = JSON.stringify({
      message: "sendmessage",
      data: data,
    });

    socket.send(message);


Handler
wss://tdbwzjxlk4.execute-api.us-west-1.amazonaws.com/prod?serviceName=boundaryAreaOverlap&cacheKey=35354-2024-08-01T19%3A37%3A55.612063%2B00%3A
wss://tdbwzjxlk4.execute-api.us-west-1.amazonaws.com/prod?serviceName=boundaryAreaOverlap&cacheKey=35354-2024-08-01T19%3A37%3A55.612063%2B00%3A00&fromClient=true
client

Handler
wss://tdbwzjxlk4.execute-api.us-west-1.amazonaws.com/prod?serviceName=boundaryAreaOverlap&cacheKey=35354-2024-08-01T19:37:55.612063+00:
wss://tdbwzjxlk4.execute-api.us-west-1.amazonaws.com/prod?serviceName=boundaryAreaOverlap&cacheKey=35354-2024-08-01T19:37:55.612063+00:00&fromClient=true
client

wss://tdbwzjxlk4.execute-api.us-west-1.amazonaws.com/prod?serviceName=boundaryAreaOverlap&cacheKey=foo

Questions:
- unclear how connectionId comes from requestContext

Problems:
- subscription table is almost empty


wscat -c wss://tdbwzjxlk4.execute-api.us-west-1.amazonaws.com/pd?serviceName%3DkelpPersist%26cacheKey%3Dblord
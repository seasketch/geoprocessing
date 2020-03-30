if (!global.fetch) {
  global.AbortController = require("node-abort-controller");
  global.fetch = require("node-fetch");
  global.Response = global.fetch.Response;
  global.Headers = global.fetch.Headers;
  global.Request = global.fetch.Request;
}

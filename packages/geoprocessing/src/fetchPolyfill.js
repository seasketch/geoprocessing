if (!global.fetch) {
  global.fetch = require("node-fetch").default;
  global.Response = global.fetch.Response;
  global.Headers = global.fetch.Headers;
  global.Request = global.fetch.Request;
  require("abortcontroller-polyfill/dist/polyfill-patch-fetch");
}

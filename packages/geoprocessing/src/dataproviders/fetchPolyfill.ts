import fetch, {
  Headers,
  Request,
  Response,
  RequestInit,
  RequestInfo,
} from "node-fetch";
import http from "http";

http.globalAgent.maxSockets = 10;

/**
 * Custom fetch function that uses custom http agent to force connections to not be reused
 * @param url
 * @param init
 * @returns
 */
const customFetch = async (
  url: URL | RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const agent = new http.Agent({ keepAlive: false, maxSockets: 25 });
  const options = {
    ...init,
    agent,
  };
  return fetch(url, init);
};

// Always polyfill, because of issue with native Node v20 fetch API causing request timeout.  Node v21 and up should be stable, and this polyfill can be removed in the future
if (globalThis) {
  //@ts-ignore
  globalThis.fetch = customFetch;
  //@ts-ignore
  globalThis.Headers = Headers;
  //@ts-ignore
  globalThis.Request = Request;
  //@ts-ignore
  globalThis.Response = Response;
}

import "abortcontroller-polyfill/dist/polyfill-patch-fetch.js";

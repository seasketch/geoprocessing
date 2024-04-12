import fetch, {
  Blob,
  blobFrom,
  blobFromSync,
  File,
  fileFrom,
  fileFromSync,
  FormData,
  Headers,
  Request,
  Response,
} from "node-fetch";

// Always polyfill, because of issue with native Node v20 fetch API causing request timeout.  Node v21 and up should be stable, and this polyfill can be removed in the future
if (globalThis) {
  //@ts-ignore
  globalThis.fetch = fetch;
  //@ts-ignore
  globalThis.Headers = Headers;
  //@ts-ignore
  globalThis.Request = Request;
  //@ts-ignore
  globalThis.Response = Response;
}

import "abortcontroller-polyfill/dist/polyfill-patch-fetch.js";

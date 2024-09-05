import http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

export function startLocalServer(
  options: { path: string; port: number } = { path: "./", port: 8001 },
) {
  const serve = serveStatic(options.path);
  const server = http.createServer(function (req, res) {
    const done = finalhandler(req, res);
    serve(req, res, done as () => void);
  });
  server.listen(options.port);
}

/**
 * Local file server, for quickly serving static files
 */
export default class LocalFileServer {
  private _server: http.Server;

  constructor(options: { path?: string; port?: number }) {
    const { path = "./", port = 8001 } = options;
    const serve = serveStatic(path);
    this._server = http.createServer(function (req, res) {
      const done = finalhandler(req, res, {
        onerror: LocalFileServer.logerror,
      });
      serve(req, res, done as () => void);
    });
    this._server.listen(port);
    this._server.setTimeout(5000, () => {
      console.log("Timeout after 5 seconds");
      this._server.close(() => {
        console.log("Server is closed");
      });
    });
  }

  public close(): void {
    this._server.close();
  }

  static logerror(err) {
    console.error(err.stack || err.toString());
  }
}

import http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

// Switch to parseGeoraster

export function startLocalServer(
  options: { path: string; port: number } = { path: "./", port: 8000 }
) {
  const serve = serveStatic(options.path);
  const server = http.createServer(function (req, res) {
    const done = finalhandler(req, res);
    serve(req, res, done as () => void);
  });
  server.listen(options.port);
}

/**
 * Local file server, for quick programmatic use (e.g. load raster with geoblaze), then close
 */
export default class LocalFileServer {
  private _server: http.Server;

  constructor(options: { path?: string; port?: number }) {
    const { path = "./", port = 8000 } = options;
    const serve = serveStatic(path);
    this._server = http.createServer(function (req, res) {
      const done = finalhandler(req, res);
      serve(req, res, done as () => void);
    });
    this._server.listen(port);
  }

  public close(): void {
    this._server.close();
  }
}

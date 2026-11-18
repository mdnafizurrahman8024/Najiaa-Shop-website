const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const host = process.env.HOST || "127.0.0.1";
const requestedPort = Number(process.env.PORT) || 3000;
const maxPort = requestedPort + 20;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((request, response) => {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  if (pathname === "/") pathname = "/index.html";

  const relativePath = pathname.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });

    fs.createReadStream(filePath)
      .on("error", () => {
        if (!response.headersSent) {
          response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        }
        response.end("Server error");
      })
      .pipe(response);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && server.listenPort < maxPort) {
    const alternatePort = server.listenPort + 1;
    console.log(`Port ${server.listenPort} is busy. Trying port ${alternatePort}...`);
    start(alternatePort);
  } else {
    console.error(`Unable to start the Najiaa Shop server: ${error.message}`);
    process.exit(1);
  }
});

function start(port) {
  server.listenPort = port;
  server.listen(port, host);
}

server.on("listening", () => {
  const address = server.address();
  console.log(`Najiaa Shop is running at http://${host}:${address.port}`);
  console.log(`If this port is busy, the server will try up to http://${host}:${maxPort}`);
});

start(requestedPort);

import http from "node:http";
import { readFile } from "node:fs/promises";
const files = {
  "/": "index.html",
  "/index.html": "index.html",
  "/style.css": "style.css",
  "/app.js": "app.js",
  "/core.js": "core.js",
  "/storage.js": "storage.js",
};
http
  .createServer(async (req, res) => {
    const file = files[new URL(req.url, "http://localhost").pathname];
    if (!file) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    try {
      const content = await readFile(new URL(file, import.meta.url));
      res.writeHead(200, {
        "Content-Type": file.endsWith(".html")
          ? "text/html; charset=utf-8"
          : file.endsWith(".css")
            ? "text/css"
            : "text/javascript",
        "Cache-Control": "no-store",
      });
      res.end(content);
    } catch {
      res.writeHead(500);
      res.end("Unable to read application file");
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("Studywell: http://127.0.0.1:4173"),
  );

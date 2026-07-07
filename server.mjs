import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = __dirname;
const port = Number(process.env.PORT || 3000);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

const apiModules = new Map();

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function createApiResponse(res) {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      send(res, this.statusCode, JSON.stringify(payload), {
        "Content-Type": "application/json; charset=utf-8",
        ...this.headers
      });
    },
    end(payload = "") {
      send(res, this.statusCode, payload, this.headers);
    }
  };
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function handleApi(req, res, url) {
  const route = url.pathname.replace(/^\/api\//, "").replace(/\.js$/, "");
  const apiFile = path.join(__dirname, "api", `${route}.js`);

  if (!existsSync(apiFile)) {
    send(res, 404, JSON.stringify({ error: "API route not found" }), {
      "Content-Type": "application/json; charset=utf-8"
    });
    return;
  }

  if (!apiModules.has(apiFile)) {
    apiModules.set(apiFile, import(pathToFileURL(apiFile).href));
  }

  req.query = Object.fromEntries(url.searchParams.entries());
  req.body = await readJsonBody(req);

  const mod = await apiModules.get(apiFile);
  const handler = mod.default;
  await handler(req, createApiResponse(res));
}

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const resolved = path.join(root, normalized);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function resolveStaticFile(url) {
  if (url.pathname === "/") return path.join(publicRoot, "index.html");

  if (url.pathname.startsWith("/plan/")) {
    const direct = safeJoin(publicRoot, url.pathname);
    if (direct && existsSync(direct) && statSync(direct).isFile()) return direct;
    return path.join(publicRoot, "plan", "index.html");
  }

  const candidate = safeJoin(publicRoot, url.pathname);
  if (!candidate) return null;

  if (existsSync(candidate)) {
    const stats = statSync(candidate);
    if (stats.isDirectory()) {
      const indexFile = path.join(candidate, "index.html");
      if (existsSync(indexFile)) return indexFile;
    }
    if (stats.isFile()) return candidate;
  }

  return null;
}

function serveStatic(req, res, url) {
  const file = resolveStaticFile(url);
  if (!file) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const headers = {
    "Content-Type": mimeTypes.get(ext) || "application/octet-stream"
  };

  if (req.method === "HEAD") {
    send(res, 200, "", headers);
    return;
  }

  res.writeHead(200, headers);
  createReadStream(file).pipe(res);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    if (!["GET", "HEAD"].includes(req.method || "GET")) {
      send(res, 405, "Method not allowed", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    serveStatic(req, res, url);
  } catch (error) {
    console.error("Server error:", error);
    send(res, 500, "Internal server error", { "Content-Type": "text/plain; charset=utf-8" });
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`PelvicFit server listening on 0.0.0.0:${port}`);
});

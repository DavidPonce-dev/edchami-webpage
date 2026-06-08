const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const httpProxy = require("http-proxy");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const BOT_URL = process.env.DISCORD_BOT_URL || "http://localhost:3002";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";

const vncProxy = httpProxy.createProxyServer({
  target: BOT_URL,
  ws: true,
  changeOrigin: true,
});

vncProxy.on("proxyReq", (proxyReq, req) => {
  if (BOT_TOKEN) {
    const url = new URL(proxyReq.path, BOT_URL);
    url.searchParams.set("token", BOT_TOKEN);
    proxyReq.path = url.pathname + url.search;
  }
});

vncProxy.on("error", (err) => {
  console.error("[VNC Proxy Error]", err.message);
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith("/api/bot/vnc")) {
      vncProxy.web(req, res, { target: BOT_URL });
      return;
    }

    handle(req, res, parsedUrl);
  });

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "");

    if (pathname && pathname.startsWith("/api/bot/vnc")) {
      vncProxy.ws(req, socket, head);
    }
  });

  const port = parseInt(process.env.PORT || "3000", 10);

  server.listen(port, "0.0.0.0", () => {
    console.log(`> Server running on http://0.0.0.0:${port}`);
    console.log(`> VNC proxy targeting: ${BOT_URL}`);
  });
});

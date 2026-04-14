const { createServer } = require("http");
const next = require("next");
const { initSocket } = require("./lib/socket");

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handler(req, res);
  });

  initSocket(server);

  server.listen(3000, () => {
    console.log("🚀 Server running on https://koniqtech.com/");
  });
});
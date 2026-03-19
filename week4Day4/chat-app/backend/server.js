const http = require("http");
const { app, setIo } = require("./app");
const { initSocket } = require("./socket");

const PORT = 5000;

const server = http.createServer(app);
const io = initSocket(server);
setIo(io); // give the messages route access to broadcast

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

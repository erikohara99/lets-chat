const app = require("express")();
const server = require("http").createServer(app);
const sio = require("socket.io");
const io = new sio.Server(server);

server.listen(8080, () => {console.log("Server started on port 8080")});
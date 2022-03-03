const app = require("express")();
const server = require("http").createServer(app);
const sio = require("socket.io");
const io = new sio.Server(server);

io.on("connection", socket => {
    console.log("[CONNECT] New connection");

    socket.on("disconnect", () => {
        console.log("[DISCONNECT] Connection terminated");
    })
})

server.listen(8080, () => {console.log("Server started on port 8080")});
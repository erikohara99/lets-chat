const app = require("express")();
const server = require("http").createServer(app);
const sio = require("socket.io");
const io = new sio.Server(server, {cors: {origin: "*"}});

io.on("connection", socket => {
    console.log("[CONNECT] New connection");

    socket.on("disconnect", () => {
        console.log("[DISCONNECT] Connection terminated");
    })

    socket.on("send", (text) => {
        console.log(text);
        let time = new Date();
        time = `${time.getHours()}:${time.getMinutes()}`
        io.emit("message", {text, time});

    })
})

server.listen(8080, () => {console.log("Server started on port 8080")});
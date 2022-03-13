const app = require("express")();
const server = require("http").createServer(app);
const sio = require("socket.io");
const io = new sio.Server(server, {cors: {origin: "*"}});

const emit_message = (event, text, name = "Anonymous") => {
    let time = new Date();
    time = `${time.getHours()}:${time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()}`;
    io.emit(event, {text, time, name});
}

io.on("connection", socket => {
    console.log("[CONNECT] New connection");
    emit_message("message", "USER HAS CONNECTED", "[SERVER]");

    socket.on("disconnecting", () => {
        emit_message("message", "USER HAS DISCONNECTED", "[SERVER]");
    })

    socket.on("disconnect", () => {
        console.log("[DISCONNECT] Connection terminated");
    })

    socket.on("send", (text) => {
        emit_message("message", text);
    })
})

server.listen(8080, () => {console.log("Server started on port 8080")});
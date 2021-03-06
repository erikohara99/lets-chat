const app = require("express")();
const server = require("http").createServer(app);
const sio = require("socket.io");
const io = new sio.Server(server, {cors: {origin: "*"}});

const emitMessage = (text, name = "Anonymous") => {
    let time = new Date();
    time = `${time.getHours()}:${time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()}`;

    io.emit("message", {text, time, name});
}

const emitMessageServer = (text, id = null) => {
    let name = "[SERVER]";
    let time = new Date();
    time = `${time.getHours()}:${time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes()}`;

    if(!id) return io.emit("message", {text, time, name});
    return io.to(id).emit("message", {text, time, name});
}

const changeNickname = (socket, nickname) => {

    const users = io.sockets.adapter.rooms.get("General");
    for(let user of users) {
        user = io.sockets.sockets.get(user);
        if(user.nickname == nickname) return emitMessageServer("Nickname already taken.", socket.id);
    }

    let old = socket.nickname;
    socket.nickname = nickname;
    emitMessageServer(`'${old}' IS NOW KNOWN AS '${nickname}'.`);
}

io.on("connection", socket => {
    console.log("[CONNECT] New connection");
    socket.join("General");
    socket.nickname = "Anonymous";
    emitMessageServer(`'${socket.nickname}' HAS JOINED THE ROOM.`);

    socket.on("disconnecting", () => {
        emitMessageServer(`'${socket.nickname}' HAS LEFT THE ROOM.`);
    })

    socket.on("disconnect", () => {
        console.log("[DISCONNECT] Connection terminated");
    })

    socket.on("send", (text) => {
        let split = text.split(" ");
        if(split[0] == "/name"){
            if(/^[a-zA-Z]{4,12}$/.exec(split[1])) return changeNickname(socket, text.split(" ")[1]);
            return emitMessageServer("Name must be between 4-12 length, letters only.", socket.id);
        }

        return emitMessage(text, socket.nickname);
    })
})

server.listen(8080, () => {console.log("Server started on port 8080")});
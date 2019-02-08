var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var users = {};

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});



io.on("connection", function(socket){
    socket.join("home");
    console.log(socket.rooms);
    users[socket.id] = {
        id: socket.id,
        userName: ""
    }
    io.emit("connectionChange", {msg: "user connected", userList: users});
    socket.on('disconnect', function(){
        io.emit("connectionChange", {msg: users[socket.id].userName + " disconnected.", userList: users});
        delete users[socket.id];
    });
    socket.on("typing", function(user){
        //console.log("hello");
        socket.broadcast.emit("typing", user);
    });
    socket.on('chat message', function(payload){
        socket.broadcast.emit("chat message", payload);
      });
    socket.on("save name", function(name){
        users[socket.id].userName = name;
        console.log(users);
    });
    socket.on("change room", function(room) {
        console.log("changing room");
        socket.leave("home");
        socket.join(room, ()=>{
            console.log(io.sockets.adapter.rooms);

        });
    })
})

http.listen(3000, function(){
    console.log("listening on *:3000");
})

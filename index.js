var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var users = {};

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
    users[socket.id] = {
        id: socket.id,
        userName: ""
    }
    console.log(users);
    io.emit("connectionChange", {msg: "user connected", userList: users});
    socket.on('disconnect', function(){
        delete users[socket.id];
        io.emit("connectionChange", {msg:"user disconnected.", userList: users});
    });
    socket.on("typing", function(user){
        console.log("hello");
        socket.broadcast.emit("typing", user);
    });
    socket.on('chat message', function(payload){
        socket.broadcast.emit("chat message", payload);
      });
    socket.on("save name", function(name){
        socket[socket.id].userName = name;
    })
})

http.listen(3000, function(){
    console.log("listening on *:3000");
})
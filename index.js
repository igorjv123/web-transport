
const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http);
const hostname = '127.0.0.1';
const port = 3000;
//app.use(http.static(__dirname ));

var messages = [];
var users = [];
var allUsers = [];
var db = require('./db');



app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/script.js", function(req, res){
  res.sendFile(__dirname + "/script.js");
});

io.on('connection', function(socket){
  console.log('Client connected');

  socket.on('chat message', function(msg){
    messages.push(msg);
    io.emit('chat message', msg);
  });

  socket.emit('chat history', messages);

  io.emit('chat user', users);

  socket.on('chat user', function(usr){
    var check = false;
    for (var i in users) {
      if (usr.nick == users[i].nick) {
        users[i].status = 'online';
        check = true;
      }
    }
    if (!check) {
      users.push(usr);
    }

    io.emit('chat user', users);
  });

});

db.connect('mongodb://localhost:27017/users', function(err){
    if(err){
      return console.log(err);
    }
    http.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
});

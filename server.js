var value = 0;
var sockets = [];
var app = require('express')();
var server = require('http').Server(app);
var WebSocketServer = require("ws").Server;
var ws = new WebSocketServer({server: server});

server.listen(8081);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


ws.on('connection', function (socket) {
  sockets.push(socket);
  console.log("connected");

  socket.on('message', function (data) {
    var parts = data.split(" "),
        cmd = parts.shift(),
        args = parts.join(' ');

    if (cmd === "set") {
      console.log(cmd, args);
      value = parseInt(args);

      setTimeout(function() {
        try {
          for (var s in sockets) {
            sockets[s].send("" + value);
          }
        } catch (ex) {
        }
      }, Math.random() * 1000);

    } else if (cmd === "pub") {
      for (var s in sockets) {
        s.send(data);
      }
    }
  });

  socket.on('close', function() {
    console.log("disconnected");
    sockets.splice(sockets.indexOf(socket), 1);
  });

});


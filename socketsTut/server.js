// import express
// create the top level function
var express = require("express");
// assign it to app
var app = express();

var server = app.listen(3000);

// hosts everythiong in the public directory
// will serve static content from the public folder
app.use(express.static("public"));

// import socket
var socket = require("socket.io");

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log("new connection: " + socket.id);
  // console.log(socket);
  socket.on("mouse", mouseMsg);

  function mouseMsg(data){
    socket.broadcast.emit("mouse", data);
    console.log(data);
  }

}

console.log("socket server is listening");

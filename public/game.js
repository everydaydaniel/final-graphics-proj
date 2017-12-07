var gameID = localStorage.getItem('gameID');

var socketURL = 'ws'+ (window.location.protocol.indexOf('s') !== -1 ? 's' : '') +
  '://'+window.location.host+'/game';
var socket = new WebSocket(socketURL);

socket.onopen = function() {
  var msg = { type: 'connect', id: gameID };
  socket.send(JSON.stringify(msg));
  setInterval(function() {
    socket.send(JSON.stringify({ type: 'data', data: new Date().getTime() }));
  }, 1000);
};

socket.onmessage = function(e) {
  console.log(e.data);
};
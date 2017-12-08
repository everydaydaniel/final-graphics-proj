var socketURL = 'ws'+ (window.location.protocol.indexOf('s') !== -1 ? 's' : '') +
  '://'+window.location.host+'/game';
var socket = new WebSocket(socketURL);

socket.onopen = function() {
  // gameID is hydrated on the server
  var msg = { type: 'connect', id: gameID };
  socket.send(JSON.stringify(msg));
  setInterval(function() {
    socket.send(JSON.stringify({ type: 'data', data: new Date().getTime() }));
  }, 1000);
};

socket.onmessage = function(e) {
  var msg = JSON.parse(e.data);
  switch(msg.type) {
    case 'data':
      console.log(msg.data);
      break;
    case 'disconnect':
      alert('Your teammate disconnected!');
      break;
  }
};
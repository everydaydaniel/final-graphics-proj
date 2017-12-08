var socketURL = 'ws'+ (window.location.protocol.indexOf('s') !== -1 ? 's' : '') +
'://'+window.location.host+'/friend_match';
var socket = new WebSocket(socketURL);

socket.onopen = function() {
  socket.send(gameID);
};

socket.onmessage = function(e) {
  socket.close();
  document.getElementById('redirect-form').submit();
};
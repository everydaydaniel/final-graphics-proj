var dots = 0;
var waiting = document.getElementById('waiting');
var message = waiting.textContent;
setInterval(function() {
  var text = message;
  dots = (dots + 1) % 5;
  for (var i = 0; i < dots; i++) {
    text += '.';
  }
  waiting.innerText = text;
}, 500);

var socketURL = 'ws'+ (window.location.protocol.indexOf('s') !== -1 ? 's' : '') +
  '://'+window.location.host+'/match';
var socket = new WebSocket(socketURL);
socket.onmessage = function(e) {
  var gameID = e.data;
  socket.close();
  localStorage.setItem('gameID', gameID);
  window.location = '/game';
};

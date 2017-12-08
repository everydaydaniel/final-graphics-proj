// Fancy progress animation
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

// Wait for a match
var socketURL = 'ws'+ (window.location.protocol.indexOf('s') !== -1 ? 's' : '') +
  '://'+window.location.host+'/match';
var socket = new WebSocket(socketURL);

// Friend connected to our game
socket.onmessage = function(e) {
  socket.close();
  var gameID = e.data;
  document.getElementById('code-input').setAttribute('value', gameID);
  document.getElementById('redirect-form').submit();
};

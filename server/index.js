var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

app.listen(80);
console.log('listening on port 80');
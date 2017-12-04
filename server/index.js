var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');

var port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

app.listen(port);
console.log('listening on port ' + port);
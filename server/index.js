var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var session = require('express-session');
var uid = require('rand-token').uid;
var path = require('path');

var port = process.env.PORT || 8080;
var publicPath = path.resolve(__dirname, '../public');

var users = {};
var randomMatchers = [];
var games = {};

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Create session entries
app.use(function (req, res, next) {
  users[req.sessionID] = users[req.sessionID] || {
    matching: false,
    inGame: false,
  };
  next(); 
});

app.get('/game', function(req, res) {
  res.sendFile(path.join(publicPath, 'game/index.html'));
});
app.ws('/game', function(ws, req) {
  ws.send(JSON.stringify(req));
});

app.ws('/match', function(ws, req) {
  if (randomMatchers.length > 0) {  // Players available
    var gameID = uid(4);
    var matchedPlayer = randomMatchers.shift();
    games[gameID] = {
      players: [matchedPlayer, req.sessionID]
    };

    users[matchedPlayer].onMatch(gameID);
    ws.send(gameID);
  } else {                          // No players available
    users[req.sessionID].onMatch = function (partnerID) {
      ws.send(partnerID);
    };
    randomMatchers.push(req.sessionID);
  }
});

// Serve static files
app.use(express.static(publicPath));

app.listen(port);
console.log('listening on port ' + port);
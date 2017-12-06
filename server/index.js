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

app.ws('/game', function(ws, req) {
  ws.onopen = function (e) {
    console.log('connected');
  };
  ws.onmessage = function(e) {
    var msg = JSON.parse(e.data);
    var playerID = req.sessionID;
    switch (msg.type) {
      case 'connect': 
        var gameID = msg.id;
        this.game = games[gameID];
        if (this.game.players.indexOf(playerID) !== -1) {
          this.game.sockets.push({
            ws: ws,
            player: playerID,
          });
        }
        break;
      case 'data':
        this.game.sockets.forEach(function(socket) {
          console.log(socket.player);
          console.log(playerID);
          if (socket.player !== playerID) {
            socket.ws.send(msg.data);
          }
        });
    }
  };
});

app.ws('/match', function(ws, req) {
  if (randomMatchers.length > 0) {  // Players available
    var gameID = uid(4);
    var matchedPlayer = randomMatchers.shift();
    // Create new game
    games[gameID] = {
      players: [matchedPlayer, req.sessionID],
      sockets: [],
    };

    users[matchedPlayer].onMatch(gameID);
    ws.send(gameID);
  } else {                          // No players available
    users[req.sessionID].onMatch = function (partnerID) {
      ws.send(partnerID);
    };
    randomMatchers.push(req.sessionID);
  }
    console.log(randomMatchers);
});

// Serve static files
app.use(express.static(publicPath));

app.listen(port);
console.log('listening on port ' + port);
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var session = require('express-session');
var uid = require('rand-token').uid;
var path = require('path');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
var publicPath = path.resolve(__dirname, '../public');

// Faux-DB
var users = {};
var randomMatchers = [];
var games = {};

// Set up pug renderer
app.set('view engine', 'pug');
app.set('views', 'server/views');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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

// Routes
app.get('/', function(req, res ,next) {
  res.render('index');
});
app.get('/friend', function(req, res, next) {
  var code = uid(6);
  res.render('friend', { title: 'Play With a Friend', code: code });
});
app.get('/random', function(req, res, next) {
  res.render('random', { title: 'Finding a Teammate' });
});
app.post('/game', function(req, res, next) {
  console.log(req.body);
  res.render('game', { title: 'Play' });
});

// Sockets
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

// Start the server
app.listen(port);
console.log('listening on port ' + port);
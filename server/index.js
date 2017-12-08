/*

- Create Friend Match
1. client visits friend page
2. sends code to friend
3. when friend joins match, client navigates to game page using hidden form (POST)

- Join Friend Match
1. client visits friend page
2. enters game code
3. submit button sends them to game page (POST)
4. use request body to hydrate gameID in script

Game Page
/game
on post, template rendered with game code in variable
establish websocket and send game code
add ws to game object
start game

*/

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
var friendMatchers = {};
var games = {};
function Game(players) {
  this.players = players || [];
  this.sockets = [];
}

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
  var code = req.body.code;
  // Joining a friend match
  if (friendMatchers.hasOwnProperty(code)) {
    // Create game
    games[code] = new Game([req.sessionID, friendMatchers[code].id]);
    // Notify game creator (message doesn't matter)
    friendMatchers[code].socket.send('ready');
    // Cleanup game creator code
    delete friendMatchers[code];
    // Cleanup game joiner code
    if (req.body.hasOwnProperty('unusedCode')) {
      delete friendMatchers[req.body.unusedCode];
    }
  }
  res.render('game', { title: 'Game', code: code });
});

// Sockets
app.ws('/game', function(ws, req) {
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
          if (socket.player !== playerID) {
            socket.ws.send(msg.data);
          }
        });
    }
  };
});

// Random matchmaking
app.ws('/match', function(ws, req) {
  if (randomMatchers.length > 0) {  // Players available
    var matchedPlayer = randomMatchers.shift();
    // Create new game
    var gameID = uid(6);
    games[gameID] = new Game([matchedPlayer, req.sessionID]);

    // Alert players 
    users[matchedPlayer].onMatch(gameID);
    ws.send(gameID);
  } else {                          // No players available
    users[req.sessionID].onMatch = function (gameID) {
      ws.send(gameID);
    };
    randomMatchers.push(req.sessionID);
  }
});
// Friend matchmaking
app.ws('/friend_match', function(ws, req) {
  ws.onmessage = function(e) {
    var gameID = e.data;
    friendMatchers[gameID] = {
      socket: ws,
      id: req.sessionID,
    };
  };
});

// Serve static files
app.use(express.static(publicPath));

// Start the server
app.listen(port);
console.log('listening on port ' + port);
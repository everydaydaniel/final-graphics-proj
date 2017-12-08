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
function Game(players, id) {
  this.id = id || uid(6);
  games[this.id] = this;
  this.players = players || [];
  this.sockets = [];
}
Game.prototype.connect = function(playerID, socket) {
  if (this.players.indexOf(playerID) !== -1) {
    this.sockets.push({
      ws: socket,
      player: playerID,
    });
  }
};
Game.prototype.disconnect = function(playerID) {
  this.sockets = this.sockets.filter(function(socket) {
    return socket.player !== playerID;
  });

  if (this.sockets.length === 0) {  // Cue game for garbage collection
    delete games[this.id];
    console.log('Game ' + this.id + ' destroyed.');
  } else {
    this.sockets.forEach(function(socket) {
      socket.ws.send(JSON.stringify({ type: 'disconnect' }));
    });    
  }
};
Game.prototype.send = function(senderID, data) {
  this.sockets.forEach(function(socket) {
    if (socket.player !== senderID) {
      try {
        socket.ws.send(JSON.stringify({ type: 'data', data: data }));
      } catch(err) {
        console.warn('Sending data to ' + socket.player + ' failed:');
        console.warn(err.message);
      }
    }
  });
};

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
  if (friendMatchers.hasOwnProperty(code)) {    // Joining a friend match
    console.log('creating friend match ' + code);
    // Create game
    var game = new Game([req.sessionID, friendMatchers[code].id], code);
    // Notify game creator (message doesn't matter)
    friendMatchers[code].socket.send('ready');
    // Cleanup game creator code
    delete friendMatchers[code];
    // Cleanup game joiner code
    if (req.body.hasOwnProperty('unusedCode')) {
      delete friendMatchers[req.body.unusedCode];
    }
  } else if (!code || !games.hasOwnProperty(code)) { // Game not found
    console.log('game not found, redirecting')
    res.redirect('/');
    return;
  }
  res.render('game', { title: 'Game', code: code });
});
app.get('/game', function(req, res) {
  res.redirect('/');
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
        this.game.connect(playerID, ws);
        break;
      case 'data':
        this.game.send(playerID, msg.data);
    }
  };
  ws.onclose = function() {
    this.game.disconnect(req.sessionID);
  };
});

// Random matchmaking
app.ws('/match', function(ws, req) {
  if (randomMatchers.length > 0) {  // Players available
    var matchedPlayer = randomMatchers.shift();
    // Create new game
    var game = new Game([matchedPlayer, req.sessionID]);

    // Alert players 
    users[matchedPlayer].onMatch(game.id);
    ws.send(game.id);
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
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var session = require('express-session')
var path = require('path');

var port = process.env.PORT || 8080;
var publicPath = path.resolve(__dirname, '../public');

var users = {};
var randomMatchers = [];

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

app.ws('/match', function(ws, req) {
  if (randomMatchers.length > 0) {  // Players available
    users[randomMatchers[0]].onMatch(req.sessionID);
    ws.send(randomMatchers.shift());
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
var express = require('express');
var app = express();

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var config = require('./config/config.json');

app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('views', './views');

app.use(session({
  store: new RedisStore(),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000
  }
}));

app.use(function (req, res, next){
  var session = req.session;
  if (session.views) {
    session.views += 1;
  }else{
    session.views = 1;
  }
  console.log(session.views);
  console.log('viewed', session.views, 'times!');
  next();
});

app.get('/', function (req, res){
  res.render('index', {title: 'Hello-Express'});
});


var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
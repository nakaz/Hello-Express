var express = require('express');
var app = express();

var bodyParser = require('body-parser');


var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var config = require('./config/config.json');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

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
  next();
});

app.get('/', function (req, res){
  res.render('index', {username: req.session.username});
});

app.post('/', function (req, res){
  req.session.username = req.body.username;
  res.redirect('/');
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
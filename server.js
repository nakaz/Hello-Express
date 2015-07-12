var express = require('express');
var app = express();

var bodyParser = require('body-parser');


var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


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

app.use(passport.initialize());
// app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username, password);
    var admin = config.admin;

    if(!admin){
      return done(new Error('No admin configured!'));
    }

    if (username !== admin.username) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== admin.password) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, admin);
  }
));

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

app.post('/login',
  passport.authenticate('local', { successRedirect: '/secret',
                                   failureRedirect: '/',
                                   session: false})
);

app.get('/secret', function(req, res, next){
  res.send('SECRET!');
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
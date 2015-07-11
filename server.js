var express = require('express');
var app = express();

app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('views');
app.get('/', function (req, res){
  res.render('index', {title: 'Hello-Express'});
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
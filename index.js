var express = require('express');
var app = express();

app.get('/', function (req, res) {

  res.send('Hello World!!');
});

app.get('/ver', function (req, res) {
  res.send('version 1.1.4');
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening on port %s', port);
});

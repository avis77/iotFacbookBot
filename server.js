var express = require('express'); //express handles routes
var connect = require('connect');
var http = require('http'); //need http module to create a server
var app = express(); //starting express
app.set('port', process.env.PORT || 3000); //set port to cloud9 specific port or 3000
app.use(connect.bodyParser()); //body parser used to parse request data
app.use(app.router);
app.get('/', verificationHandler);
function verificationHandler(req, res) {
  console.log(req);
  if (req.query['hub.verify_token'] === 'verifycode') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token!');
}
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
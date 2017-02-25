var express = require('express'); //express handles routes
var http = require('http'); //need http module to create a server
var app = express(); //starting express
var bodyParser = require('body-parser');
app.set('port', process.env.PORT || 3000); //set port to cloud9 specific port or 3000
app.use(bodyParser); //body parser used to parse request data
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
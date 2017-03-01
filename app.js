const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');  

const app = express();
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

/* For Facebook Validation */
app.get('/webhook',verificationHandler);
function verificationHandler(req, res) {
  if (req.query['hub.verify_token'] === 'verifycode') {
    res.send(req.query['hub.challenge']);
  }
  res.send("worng value"+req.query['hub.verify_token']);
}

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  var msg = "";
  if (req.body.object === 'page') {
	
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
		  console.log("event "+event);
        if (event.message && event.message.text) {
          msg = msg+event.message.text+".";
        }
      });
    });
	console.log("msg "+msg);
	
	res.send(msg);
    res.status(200).end();
  }
});
app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
});

module.exports = app;

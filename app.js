const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');  

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("2108421189\n");
  console.log('got wrong token', req);
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});
app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
});

module.exports = app;

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
app.post('/webhook',, receiveMessage);
function receiveMessage(req, res, next) {
    var message_instances = req.body.entry[0].messaging;
    message_instances.forEach(function(instance){
        var sender = instance.sender.id;
        if(instance.message && instance.message.text) {
            var msg_text = instance.message.text;
			console.log(sender +" : "+msg_text);
            sendMessage(sender, msg_text, true);
        }
    });
    res.sendStatus(200);
}

function sendMessage(receiver, data, isText) {
    var payload = {};
    payload = data;

    if(isText) {
        payload = {
            text: data
        };
    }

    request({
        url: conf.FB_MESSAGE_URL,
        method: 'POST',
        qs: {
            access_token: process.env.PROFILE_TOKEN || conf.PROFILE_TOKEN
        },
        json: {
            recipient: {id: receiver},
            message: payload
        }
    }, function (error, response) {
        if(error) console.log('Error sending message: ', error);
        if(response.body.error) console.log('Error: ', response.body.error);
    });
}
app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
});

module.exports = app;

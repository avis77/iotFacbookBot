const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
var mdb = require('./agentDB');

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
app.post('/webhook', receiveMessage);
function receiveMessage(req, res, next) {
    var message_instances = req.body.entry[0].messaging;
    message_instances.forEach(function(instance){
        var sender = instance.sender.id;
        if(instance.message && instance.message.text) {
            var msg_text = instance.message.text;
            if(msg_text == "c"){
              mdb.addAgent(sender,sendMessage);
            }else{
              if(msg_text.startsWith("r"){
                mdb.remAgent(msg_text.split(" ")[1],sender,sendMessage);
              }else{
                if(msg_text == "l"){
                  mdb.getAllMyAgents(sender,sendMessage);
                }else{

              if(msg_text.startsWith("reg")){
                mdb.RegFolowers(msg_text.split(" ")[1],sender,sendMessage);
              }else{
                if(msg_text.startsWith("rem")){
                  mdb.RemFolowers(msg_text.split(" ")[1],sender,sendMessage);
                }else{
                  sendMessage(sender, "only acsept c \\ r <id> \\ reg <id> \\ rem <id>", true);
                }
              }
            }
          }
}
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
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: 'POST',
        qs: {
            access_token: 'EAAZAl6ql27YQBAPx1pcNefvwuk56UqPeKsakmnzvPvnDiKepdJtzKkNtRXokMpMQ1MqH3HxW0irzd1Tq4Kfevq5IJQH6l7gyim8dRQUIDcPyOOT34V72EB9KGzZAZBYesdyR6Qf0sehqTToZAzjRoHCkZAV6gsZCcsWbFJKEFseQZDZD'
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
  sendMessage(req.query['agent'],req.query['msg'],true);
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("data sent to listener by agent"+req.query['agent']);
});

app.get('/list', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  mdb.getAllFolowers(req.query['agent'],res);
});

module.exports = app;

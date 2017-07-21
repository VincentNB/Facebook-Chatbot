// app.get('/webhook', function(req, res) {
//   if (req.query['hub.mode'] === 'subscribe' &&
//       req.query['hub.verify_token'] === <VERIFY_TOKEN>) {
//     console.log("Validating webhook");
//     res.status(200).send(req.query['hub.challenge']);
//   } else {
//     console.error("Failed validation. Make sure the validation tokens match.");
//     res.sendStatus(403);          
//   }  
// });
var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is fb-chatbot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'chatbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// recieve messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }else if(event.message && event.message.attachments){
        	var lat = event.message.attachments[0].payload.coordinates.lat
			var lng = event.message.attachments[0].payload.coordinates.long
			sendMessage(event.sender.id, {text: "Lat/Long: " + lat + " " + lng});
        }
    }
    res.sendStatus(200);
});

//generic function sending messages
function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// curl -X POST -H "Content-Type: application/json" -d '{'
// 	"recipient":{
// 		"id":"USER_ID"
// 	},
// 	"message":{
// 		"text":"Please share your location:",
// 		"quick_replies":[
// 		{
// 			"content_type":"location",
// 		}
// 		]
// 	}
// '}' "https://graph.facebook.com/v2.6/me/messages?access_token=PAGE_ACCESS_TOKEN"

//function send lat & lng
function geoMessage(recipientId, text){
	message = {
		"location"
	}
}

//     var data = req.body;

//     	//Iterate over each entry
//     	data.entry.forEach(function(entry){
//     		var pageID = entry.id;
//     		var timeOfEvent = entry.time;

//     		entry.messaging.forEach(function(event) {
//     			if(event.message){
//     				receivedMessage(event);
//     			}else{
//     				console.log("Webhook received unknown event: ", event);
//     			}
//     		});
//     	});
//     	res.sendStatus(200);
// });

// function receivedMessage(event){
// 	var senderID = event.sender.id;
// 	var recipientID = event.recipient.id;
// 	var timeOfMessage = event.timestamp;
// 	var message = event.message;

// 	console.log("Received message for user %d and page %d with message:", senderID, recipientID, timeOfMessage);
// 	console.log(JSON.stringify(message));

// 	var messageId = message.mid;

// 	var messageText = message.text;
// 	var messageAttachments = message.attachments;

// 	if(messageText){
// 		sendTextMessage(senderID);
// 	}else if(messageAttachments){
// 		sendTextMessage(senderID, "Msg with attachment");
// 	}
// }

// function sendTextMessage(recipientId, messageText){
// 	var messageData = {
// 		recipient: {id: recipientId}, message: {text: messageText}
// 	};
// 	callSendAPI(messageData);
// }

// function callSendAPI(messageData){
// 	request({
// 		uri: 'https://graph.facebook.com/v2.6/me/messages',
// 		qs: {access_token: PAGE_ACCESS_TOKEN},
// 		method: 'POST',
// 		json: messageData
// 	}, function(error, response, body){
// 		if (!error && response.statusCode == 200) {
// 			var recipientId = body.recipient_id;
// 			var messageId = body.message_id;

// 			console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
// 		}else{
// 			console.error("Unable to send message.");
// 			console.error(response);
// 			console.error(error);
// 		}
// 	});
// }


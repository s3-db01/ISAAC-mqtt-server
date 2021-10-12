const mqtt = require("mqtt");
var mqttMessage
var options = {
    clientId: "mqtt.fhict.nl",
    username: "i459821_isaac",
    password: "Gdu7grSJH06E5c",
    port: 8883,
    clean: true
};

var client = mqtt.connect('mqtts://mqtt.fhict.nl', options)

client.on('connect', function () {
    console.log("connected")
    client.subscribe('private/i459821_isaac/#', function (err) {
        if (!err) {
            console.log("subscribed");
        } else {
            console.log(err);
        }
    })
})

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

client.on('message', function (topic, message) {
    // message is Buffer
    console.log("recieved");
    //console.log(topic.toString());
    var returnTopic = topic.toString();
    var splitReturnTopic = returnTopic.split("/")
    wss.on('connection', ws => {
        ws.send(message.toString())
    });

    //console.log(splitReturnTopic[2], splitReturnTopic[3], splitReturnTopic[4], splitReturnTopic[5], message.toString());
    mqttMessage = JSON.parse(message.toString());
})

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    })
});


